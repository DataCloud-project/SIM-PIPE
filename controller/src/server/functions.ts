import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import * as fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import * as controller from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';
import DSL from './dsl.js';
import TaskQueue from './taskqueue.js';
import type {
  AllRunsAndStepsQuery,
  AllSimulationsQuery,
  CreateRunMutation,
  CreateSimulationMutation,
  CreateStepMutation,
  GetRunDetailsQuery,
  GetSimulationDslQuery,
  GetSimulationQuery,
  GetSimulationRunResultsQuery,
  GetUseridFromRunQuery,
  GetUseridFromSimulationQuery,
} from '../db/database.js';
import type * as types from '../types.js';
import type { StepDSLType as StepDSL } from './dsl.js';

dotenv.config();

let client: GraphQLClient;
let sdk: ReturnType<typeof getSdk>;

function connectHasuraEndpoint(): void {
  const hasura = process.env.HASURA ?? 'http://127.0.0.1:8080/v1/graphql';
  if (!process.env.HASURA_ADMIN_SECRET) {
    throw new Error('Hasura admin password not set in env file');
  }
  client = new GraphQLClient(hasura, {
    headers: {
      'x-hasura-admin-secret': process.env.HASURA_ADMIN_SECRET,
    },
  });
  sdk = getSdk(client);
}

const uploadDirectory = 'uploaded_files/';

export async function allSimulations(userid: string): Promise<AllSimulationsQuery> {
  return await sdk.AllSimulations({ userid });
}

export async function allRunsSteps(userid: string): Promise<AllRunsAndStepsQuery> {
  return await sdk.allRunsAndSteps({ userid });
}

// variable to represent prerequistes for each step number; used in detecting cycles
let prerequisites: number[][] = [];
const cyclicStepNumbers: number[] = [];

/**
 * WIP recursive function to check for cycles in the pipeline
 * reference algorithm: https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
 * */
function isCyclicRecursive(
  stepNumber: number, visited: boolean[], recursiveStack: boolean[],
): boolean {
  if (recursiveStack[stepNumber]) return true;
  if (visited[stepNumber]) return false;

  // eslint-disable-next-line no-param-reassign
  recursiveStack[stepNumber] = true;
  // eslint-disable-next-line no-param-reassign
  visited[stepNumber] = true;
  for (const prereqStep of prerequisites[stepNumber]) {
    const result = isCyclicRecursive(prereqStep, visited, recursiveStack);
    if (result) {
      cyclicStepNumbers.push(prereqStep);
      return true;
    }
  }
  // eslint-disable-next-line no-param-reassign
  recursiveStack[stepNumber] = false;
  return false;
}

/**
 * WIP function to check for cycles in the pipeline
 * reference algorithm: https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
 * */
async function isCyclic(pipeline_description: string): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const { steps } = DSL.parse(pipeline_description);
  const visited = Array.from({ length: steps.length + 1 }).fill(false) as boolean[];
  const recursiveStack = Array.from({ length: steps.length + 1 }).fill(false) as boolean[];
  prerequisites = [];
  let initialStepCount = 0;
  for await (const step of steps) {
    prerequisites[step.step_number] = step.prerequisite || [];
    // check if the number of initial steps; throw error if more than 1 initial step is present
    // TODO: change this once the modification is made
    if (!step.prerequisite) initialStepCount += 1;
  }
  if (initialStepCount > 1) {
    throw new Error('Failed! Pipeline with more than 1 initial steps are currently not supported');
  }
  for await (const step of steps) {
    const result = isCyclicRecursive(step.step_number, visited, recursiveStack);
    if (result) return true;
  }
  return false;
}

export async function createSimulation(
  name: string, pipeline_description: string, userid: string,
): Promise<string> {
  const cyclicFlag = await isCyclic(pipeline_description);
  if (cyclicFlag) {
    throw new Error(`Given simulation has cyclic dependency in step numbers: ${cyclicStepNumbers.join(', ')}`);
  }

  // disabling await-thenable, await is needed for sequential execution
  const result: CreateSimulationMutation = await sdk.createSimulation({
    name,
    pipeline_description: JSON.parse(pipeline_description),
    userid,
  });
  if (!result?.create_simulation?.simulation_id) {
    throw new Error('🎌 Undefined expression in createSimulation');
  }
  // read pipeline_description and extract env variable list
  return result.create_simulation.simulation_id;
}

export async function createStep(run_id: string, name: string, image: string,
  pipeline_step_number: number): Promise<string> {
  // disabling await-thenable, await is needed to wait till sdk.createStep completes execution
  const result: CreateStepMutation = await sdk.createStep({
    run_id,
    name,
    image,
    pipeline_step_number,
  });
  if (!result.insert_steps_one?.step_id) {
    throw new Error('🎌 Undefined results from sdk.createStep');
  }
  const stepId = result.insert_steps_one.step_id;
  logger.info(`Step created with id ${stepId}`);
  return `${stepId}`;
}

/**
 * function to read dsl parameter in simulation table
 *
 * */
async function parseDSL(simulation_id: string): Promise<StepDSL[]> {
  // get dsl from simulation table using simulation_id
  const result: GetSimulationDslQuery = await sdk.getSimulationDSL({ simulation_id });
  const json: unknown = JSON.parse(result.simulations[0].pipeline_description as string);
  const dslInstance = DSL.parse(json);
  const { steps } = dslInstance;
  return steps;
}

/**
 * function to create a run and each component step in the database
 */
export async function createRun(simulation_id: string, name: string, userid: string,
  environment_list: [[string]], timeout_values: [number]): Promise<string> {
  // read dsl, validate and use it to create steps in the run
  const steps: Array<StepDSL> = await parseDSL(simulation_id);
  const result: CreateRunMutation = await sdk.createRun({
    simulation_id,
    name,
    userid,
    env_list: environment_list,
    timeout_values,
  });
  if (!result.insert_runs_one?.run_id) {
    throw new Error('🎌 Undefined results from sdk.createRun function');
  }
  // create all steps in the database
  const { run_id: runId } = result.insert_runs_one;
  logger.info(`Run created with id ${runId}`);
  for await (const step of steps) {
    await createStep(runId, step.name, step.image, step.step_number);
  }
  return runId;
}

/**
 * function to check if a run belongs to the logged in user
 */
async function checkRunOwner(run_id: string, userid: string): Promise<void> {
  const result: GetUseridFromRunQuery = await sdk.getUseridFromRun({ run_id });
  if (result.runs[0].userid !== userid) {
    throw new Error('Invalid access; run does not belong to the user');
  }
}

/**
 * function to check if a simulation belongs to the logged in user
 */
async function checkSimulationOwner(simulation_id: string, userid: string): Promise<void> {
  const result: GetUseridFromSimulationQuery = await sdk.getUseridFromSimulation({ simulation_id });
  if (result.simulations[0].userid !== userid) {
    throw new Error('Invalid access; simulation does not belong to the user');
  }
}

/**
 * function to validate creation of a new run and storage of sample input provided
 */
export async function createRunWithInput(simulation_id: string,
  name: string, sampleInput: [[string, string]], userid: string, environment_list: [[string]],
  timeout_values: [number]): Promise<string> {
  // only owner of the simulation can create a new run
  await checkSimulationOwner(simulation_id, userid);
  const runId = await createRun(simulation_id, name, userid, environment_list, timeout_values);
  // write sample input to uploaded_files/runId
  fs.mkdirSync(`${uploadDirectory}${runId}`, { recursive: true });
  for (const [inputName, inputContent] of sampleInput) {
    if (!inputContent) {
      throw new Error('Content of input file undefined in functions.createRunWithInput');
    }
    fs.writeFile(`${uploadDirectory}${runId}/${inputName}`, inputContent, (error) => {
      if (error) { throw new Error('Error in createRunWithInput'); }
    });
  }
  return runId;
}

/**
 * function to start a run and execute each step in the SIM-PIPE sandbox
 */
export async function startRun(run_id: string): Promise<string> {
  // define lists of completed, cancelled, and failed steps
  const completed: number[] = [];
  const cancelled: number[] = [];
  const failed: number[] = [];
  let stepReady = true;
  // set run as started in the database
  await sdk.setRunAsStarted({ run_id });
  // get simulationId and step details of runId
  const result: GetRunDetailsQuery = await sdk.getRunDetails({ run_id });
  if (!result.runs) {
    throw new Error('GetRunDetailsQuery fetched no rows');
  }
  const { simulation_id: simulationId } = result.runs[0];

  // get steps, and runtime configuration entered during create run
  const { steps, env_list: environmentList, timeout_values: timeoutValues } = result.runs[0];
  // set runId and simulationId once for all runs
  const currentStep: types.Step = {
    simId: simulationId,
    runId: run_id,
    inputPath: [`${uploadDirectory}${run_id}/`],
  };
  // get the definition of step from the simulation dsl column
  const stepDefs: Array<StepDSL> = await parseDSL(simulationId);
  for await (const [index, step] of steps.entries()) {
    stepDefs[index].stepId = step.step_id;
    stepDefs[index].timeout = (timeoutValues as number[])[index];
  }
  // set input path for the first step
  process.env.INPUT_PATH = `${uploadDirectory}${run_id}/`;

  for await (const step of stepDefs) {
    stepReady = true;
    // check if there is a stop signal set to true or failed run signal set
    // changed to cancel remaining steps only if the entire run is cancelled
    if (!step.stepId) throw new Error('stepId not defined');
    if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)) {
      // mark all the remaining steps as cancelled
      await sdk.setStepAsCancelled({ step_id: step.stepId });
      await sdk.insertLog({ step_id: step.stepId, text: 'Run has been cancelled' });
      cancelled.push(step.step_number);
    } else {
      if (!environmentList || !timeoutValues) {
        throw new Error('Error! List of environment variables/ timeout values for container undefined');
      }
      // get prerequisite step numbers of the current step and verify if
      // it can be executed at this point
      if (step.prerequisite?.length > 0) {
        for (const prereqStep of step.prerequisite) {
          // if the prereq_step is completed, add input file and continue
          if (completed.includes(prereqStep)) {
            currentStep.inputPath.push(`/app/simulations/${simulationId}/${run_id}/${prereqStep}/outputs/`);
          } else if (failed.includes(prereqStep) || cancelled.includes(prereqStep)) {
            // if the prereq_step is failed/cancelled, reset input file and add it to cancelled
            // because it cannot be executed
            // eslint-disable-next-line no-await-in-loop
            await sdk.setStepAsCancelled({ step_id: step.stepId });
            // eslint-disable-next-line no-await-in-loop
            await sdk.insertLog({ step_id: step.stepId, text: 'Step cannot be executed as a dependent step has failed/cancelled' });
            cancelled.push(step.step_number);
            stepReady = false;
            break;
          } else { // if the prereq_step is waiting, reset input file and add it to end of queue
            stepDefs.push(step);
            stepReady = false;
            break;
          }
        }
      }
      if (stepReady) {
        currentStep.image = step.image;
        currentStep.stepNumber = step.step_number;
        currentStep.stepId = step.stepId;
        currentStep.env = step.env;
        // set the variable values in env file
        process.env.STEP_NUMBER = `${step.step_number}`;
        process.env.IMAGE = step.image;
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        process.env.CONTAINER_TIME_LIMIT = `${step.timeout}`;
        // adding try catch to handle failed steps
        // currentStep.env = (environmentList as [[string]])[step.pipeline_step_number - 1];
        // set the variable values in env file
        // process.env.STEP_NUMBER = `${step.pipeline_step_number}`;
        // process.env.IMAGE = step.image;
        // process.env.CONTAINER_TIME_LIMIT =
        // `${(timeoutValues as [number])[step.pipeline_step_number - 1]}`;
        try {
          await controller.start(client, currentStep);
          completed.push(step.step_number); // add successful step to the completed list
        } catch (error) {
          logger.error(`Run ${run_id} execution has failed\n${(error as Error).message}`);
          process.env.FAILED_RUN = 'true';
          failed.push(step.step_number); // add failed step to the list
        }
      }
    }
    currentStep.inputPath = [];
  }
  // remove sample input files for the run from ./uploaded folder
  fs.rmSync(`${uploadDirectory}${run_id}`, { recursive: true, force: true });
  if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)) {
    // mark the run as cancelled
    logger.info(`Run ${run_id} execution is cancelled\n`);
    await sdk.setRunAsCancelled({ run_id });
    // remove current runid from CANCEL signal
    // TODO this is not working, a run id can contain another unrelated other run id
    // and no need for env variable
    process.env.CANCEL_RUN_LIST = (process.env.CANCEL_RUN_LIST ?? '').replace(run_id, '');
    return 'cancelled';
  }
  if (process.env.FAILED_RUN === 'true') {
    // mark the run as failed
    await sdk.setRunAsFailed({ run_id });
    // set STOP signal to false for the next run
    process.env.FAILED_RUN = 'false';
    return 'failed';
  }
  // set run as completed successully in the database
  await sdk.setRunAsEndedSuccess({ run_id });
  return run_id;
}

/**
 * function to return simulation, run and step details from the database
 */
export async function getSimulationRunResults(simulation_id: string,
  run_id: string, userid: string): Promise<GetSimulationRunResultsQuery> {
  const result: GetSimulationRunResultsQuery = await sdk.getSimulationRunResults({
    simulation_id,
    run_id,
    userid,
  });
  // return JSON.stringify(result);
  return result;
}

/**
 * function to stop an active run and cancel all its remaining steps
 */
export async function stopRun(run_id: string, userid: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  // add the current runid to the environment var to denote stop signal has been sent to runid
  process.env.CANCEL_RUN_LIST = `${process.env.CANCEL_RUN_LIST as string},${run_id}`;
  return run_id;
}

/**
 * function to delete a run from the database
 */
export async function deleteRun(run_id: string, userid: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  await sdk.deleteRun({ run_id });
  return run_id;
}

/**
 * function to delete a simulation from the database
 */
export async function deleteSimulation(simulation_id: string, userid: string): Promise<string> {
  // throw error if simulation does not belong to the user
  await checkSimulationOwner(simulation_id, userid);
  await sdk.deleteSimulation({ simulation_id });
  return simulation_id;
}

const taskQueue = new TaskQueue();

/**
 * the scheduler to start runs waiting in the task queue in FIFO manner
 */
async function runScheduler(): Promise<void> {
  if (process.env.IS_SIMULATION_RUNNING === 'false') {
    while (taskQueue.getItemsCount() > 0) {
      // set variable to denote a simulation is running currently
      process.env.IS_SIMULATION_RUNNING = 'true';
      // eslint-disable-next-line no-await-in-loop
      await startRun(taskQueue.dequeue());
    }
    // set variable to denote no running simulations
    process.env.IS_SIMULATION_RUNNING = 'false';
  }
}

/**
 * function to queue a run that is to be started
 */
export async function queueRun(run_id: string, userid: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  if (process.env.IS_SIMULATION_RUNNING === 'true') {
    logger.info(`RunId ${run_id} added to task queue`);
  }
  taskQueue.enqueue(run_id);
  await sdk.setRunAsQueued({ run_id });
  runScheduler().catch((error) => {
    logger.error(`Error in run scheduler\n${(error as Error).message}`);
  });
  return 'ok';
}

/**
 * function to get all details and runs of a simulation
 */
export async function getSimulation(
  userid: string, simulation_id: string,
): Promise<GetSimulationQuery> {
  const result: GetSimulationQuery = await sdk.getSimulation({ userid, simulation_id });
  return result;
}

/**
 * function to create a sample simulation for user to test
 * wip - removed creating sample simulation; testing allsimulations with userid
 */
export async function createSampleSimulation(): Promise<string> {
  await setTimeout(7000);
  try {
    connectHasuraEndpoint();
  } catch (error) {
    const errorMessage = `\n 🎌 Error connecting from SIM-PIPE controller to hasura endpoint:\n
    ${(error as Error).message}
    Check HASURA_URL in env file, hasura endpoint and admin secret\n`;
    logger.error(errorMessage);
    logger.info('Retrying connecting from controller to hasura endpoint after 5 seconds');
    await setTimeout(5000);
    connectHasuraEndpoint();
  }
  return 'No sample simulation created for the user';
}
