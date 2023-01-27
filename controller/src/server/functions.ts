// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/naming-convention */
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import * as fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import * as controller from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';
import TaskQueue from './taskqueue.js';
import type {
  AllRunsAndStepsQuery, AllRunsAndStepsQueryVariables, AllSimulationsQuery,
  AllSimulationsQueryVariables, CreateRunMutation, CreateRunMutationVariables,
  CreateSimulationMutation, CreateSimulationMutationVariables, CreateStepMutation,
  CreateStepMutationVariables, DeleteRunMutation, DeleteRunMutationVariables, DeleteSimulationMutation, DeleteSimulationMutationVariables,
  GetRunDetailsQuery, GetRunDetailsQueryVariables,
  GetSimulationDslQuery, GetSimulationDslQueryVariables,
  GetSimulationIdandStepsQuery, GetSimulationIdandStepsQueryVariables, GetSimulationQuery, GetSimulationQueryVariables,
  GetSimulationRunResultsQuery,
  GetSimulationRunResultsQueryVariables, GetUseridFromRunQuery, GetUseridFromRunQueryVariables,
  GetUseridFromSimulationQuery, GetUseridFromSimulationQueryVariables,
  InsertLogMutation, InsertLogMutationVariables, InsertResourceUsageMutation,
  InsertResourceUsageMutationVariables, SetRunAsCancelledMutation,
  SetRunAsCancelledMutationVariables, SetRunAsEndedSuccessMutation,
  SetRunAsEndedSuccessMutationVariables, SetRunAsFailedMutation, SetRunAsFailedMutationVariables,
  SetRunAsQueuedMutation, SetRunAsQueuedMutationVariables, SetRunAsStartedMutation,
  SetRunAsStartedMutationVariables, SetStepAsCancelledMutation, SetStepAsCancelledMutationVariables,
  SetStepAsEndedSuccessMutation, SetStepAsEndedSuccessMutationVariables, SetStepAsFailedMutation,
  SetStepAsFailedMutationVariables, SetStepAsStartedMutation, SetStepAsStartedMutationVariables,
} from '../db/database.js';
import type * as types from '../types.js';

dotenv.config();

let client: GraphQLClient;
let sdk: {
  AllSimulations(variables?: AllSimulationsQueryVariables): Promise<AllSimulationsQuery>,
  allRunsAndSteps(variables?: AllRunsAndStepsQueryVariables): Promise<AllRunsAndStepsQuery>,
  createRun(variables?: CreateRunMutationVariables): Promise<CreateRunMutation>,
  createStep(variables?: CreateStepMutationVariables): Promise<CreateStepMutation>,
  setStepAsStarted(variables?: SetStepAsStartedMutationVariables): Promise<SetStepAsStartedMutation>,
  setStepAsEndedSuccess(variables?: SetStepAsEndedSuccessMutationVariables): Promise<SetStepAsEndedSuccessMutation>,
  setStepAsCancelled(variables?: SetStepAsCancelledMutationVariables): Promise<SetStepAsCancelledMutation>,
  setStepAsFailed(variables?: SetStepAsFailedMutationVariables): Promise<SetStepAsFailedMutation>,
  setRunAsStarted(variables: SetRunAsStartedMutationVariables): Promise<SetRunAsStartedMutation>,
  setRunAsQueued(variables: SetRunAsQueuedMutationVariables): Promise<SetRunAsQueuedMutation>,
  setRunAsEndedSuccess(variables: SetRunAsEndedSuccessMutationVariables): Promise<SetRunAsEndedSuccessMutation>,
  setRunAsCancelled(variables: SetRunAsCancelledMutationVariables): Promise<SetRunAsCancelledMutation>,
  setRunAsFailed(variables: SetRunAsFailedMutationVariables): Promise<SetRunAsFailedMutation>,
  createSimulation(variables: CreateSimulationMutationVariables): Promise<CreateSimulationMutation>,
  getSimulation(variables: GetSimulationQueryVariables): Promise<GetSimulationQuery>,
  getSimulationIdandSteps(variables: GetSimulationIdandStepsQueryVariables): Promise<GetSimulationIdandStepsQuery>,
  getRunDetails(variables: GetRunDetailsQueryVariables): Promise<GetRunDetailsQuery>,
  getUseridFromRun(variables: GetUseridFromRunQueryVariables): Promise<GetUseridFromRunQuery>,
  getUseridFromSimulation(variables: GetUseridFromSimulationQueryVariables): Promise<GetUseridFromSimulationQuery>,
  insertResourceUsage(variables?: InsertResourceUsageMutationVariables): Promise<InsertResourceUsageMutation>,
  insertLog(variables?: InsertLogMutationVariables): Promise<InsertLogMutation>,
  getSimulationRunResults(variables?: GetSimulationRunResultsQueryVariables):Promise<GetSimulationRunResultsQuery>
  getSimulationDSL(variables?: GetSimulationDslQueryVariables):Promise<GetSimulationDslQuery>
  deleteRun(variables?: DeleteRunMutationVariables): Promise<DeleteRunMutation>,
  deleteSimulation(variables?: DeleteSimulationMutationVariables): Promise<DeleteSimulationMutation>,
};

function connectHasuraEndpoint():void {
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

export async function allSimulations(userid:string):Promise<AllSimulationsQuery> {
  return await sdk.AllSimulations({ userid });
}
/**
 * function to return simulation, run and step details from the database
 */
export async function getSimulationRunResults(simulation_id:string,
  run_id:string, userid:string):Promise<GetSimulationRunResultsQuery> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetSimulationRunResultsQuery = await
  sdk.getSimulationRunResults({ simulation_id, run_id, userid });
  // return JSON.stringify(result);
  return result;
}

export async function allRunsSteps(userid:string):Promise<AllRunsAndStepsQuery> {
  // return JSON.stringify(await sdk.allRunsAndSteps({ userid }));
  return await sdk.allRunsAndSteps({ userid });
}

/**
 * mutations
 */

// interface for dsl step
// modified to add the new json schema attributes
interface StepDSL {
  name: string
  step_number: number
  image: string
  env: string[]
  prerequisite: number[]
  type: string
  stepId?: number
  timeout?:number
}

/**
 * function to create a component step in the database
 *
 * */
export async function createStep(run_id:string, name:string, image:string,
  pipeline_step_number:number):Promise<string> {
  // disabling await-thenable, await is needed to wait till sdk.createStep completes execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateStepMutation = await sdk.createStep({
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
async function parseDSL(simulation_id:string):Promise<[StepDSL]> {
  // get dsl from simulation table using simulation_id
  const result:GetSimulationDslQuery = await sdk.getSimulationDSL({ simulation_id });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { steps } = JSON.parse(result.simulations[0].pipeline_description as string);
  // TODO:  validate pipeline description according to schema v1
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return steps;
}
// variable to represent prerequistes for each step number; used in detecting cycles
let prerequisites:number[][] = [];
const cyclic_step_numbers:number[] = [];

/**
 * WIP recursive function to check for cycles in the pipeline
 * reference algorithm: https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
 * */
async function isCyclicRecursive(step_number: number, visited: any[], recursiveStack: any[]):Promise<boolean> {
  if (recursiveStack[step_number]) return true;
  if (visited[step_number]) return false;

  // eslint-disable-next-line no-param-reassign
  recursiveStack[step_number] = true;
  // eslint-disable-next-line no-param-reassign
  visited[step_number] = true;
  for await (const prereq_step of prerequisites[step_number]) {
    const result = await isCyclicRecursive(prereq_step, visited, recursiveStack);
    if (result) {
      cyclic_step_numbers.push(prereq_step);
      return true;
    }
  }
  // eslint-disable-next-line no-param-reassign
  recursiveStack[step_number] = false;
  return false;
}

/**
 * WIP function to check for cycles in the pipeline
 * reference algorithm: https://www.geeksforgeeks.org/detect-cycle-in-a-graph/
 * */
async function isCyclic(pipeline_description:string):Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  const steps = JSON.parse(pipeline_description).steps as Array<StepDSL>;
  const visited = Array.from({ length: steps.length + 1 }).fill(false);
  const recursiveStack = Array.from({ length: steps.length + 1 }).fill(false);
  prerequisites = [];
  for await (const step of steps) {
    prerequisites[step.step_number] = step.prerequisite || [];
  }
  for await (const step of steps) {
    const result = await isCyclicRecursive(step.step_number, visited, recursiveStack);
    if (result) return true;
  }
  return false;
}

export async function createSimulation(name:string, pipeline_description:string, userid:string):
Promise<string> {
  const value = await isCyclic(pipeline_description);
  if (value) throw new Error(`Given simulation has cyclic dependency in step numbers: ${cyclic_step_numbers as unknown as string}`);
  // disabling await-thenable, await is needed for sequential execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateSimulationMutation = await sdk.createSimulation({
    name,
    pipeline_description,
    userid,
  });
  if (!result?.create_simulation?.simulation_id) {
    throw new Error('🎌 Undefined expression in createSimulation');
  }
  // read pipeline_description and extract env variable list
  return result.create_simulation.simulation_id;
}

/**
 * function to create a run and each component step in the database
 */
export async function createRun(simulation_id:string, name:string, userid:string,
  environment_list: [[string]], timeout_values: [number]):Promise<string> {
  // read dsl, validate and use it to create steps in the run
  const steps:Array<StepDSL> = await parseDSL(simulation_id);
  const result:CreateRunMutation = await sdk.createRun({
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
async function checkRunOwner(run_id:string, userid:string):Promise<void> {
  const result:GetUseridFromRunQuery = await sdk.getUseridFromRun({ run_id });
  if (result.runs[0].userid !== userid) {
    throw new Error('Invalid access; run does not belong to the user');
  }
}

/**
 * function to check if a simulation belongs to the logged in user
 */
async function checkSimulationOwner(simulation_id:string, userid:string):Promise<void> {
  const result:GetUseridFromSimulationQuery = await sdk.getUseridFromSimulation({ simulation_id });
  if (result.simulations[0].userid !== userid) {
    throw new Error('Invalid access; simulation does not belong to the user');
  }
}

/**
 * function to validate creation of a new run and storage of sample input provided
 */
export async function createRunWithInput(simulation_id: string,
  name: string, sampleInput: [[string, string]], userid:string, environment_list: [[string]],
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
export async function startRun(run_id:string):Promise<string> {
  // define lists of completed, cancelled, and failed steps
  const completed: number[] = [];
  const cancelled: number[] = [];
  const failed: number[] = [];
  let step_ready = true;
  // set run as started in the database
  await sdk.setRunAsStarted({ run_id });
  // get simulationId and step details of runId
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetRunDetailsQuery = await sdk.getRunDetails({ run_id });
  const { simulation_id } = result.runs[0];
  if (!result.runs) {
    throw new Error('GetRunDetailsQuery fetched no rows');
  }
  // get steps, and runtime configuration entered during create run
  const { steps, env_list, timeout_values } = result.runs[0];
  // set runId and simulationId once for all runs
  const currentStep:types.Step = {
    simId: simulation_id,
    runId: run_id,
    inputPath: [`${uploadDirectory}${run_id}/`],
  };
  // get the definition of step from the simulation dsl column
  const stepDefs:Array<StepDSL> = await parseDSL(simulation_id);
  for await (const [index, step] of steps.entries()) {
    stepDefs[index].stepId = step.step_id;
    stepDefs[index].timeout = (timeout_values as number[])[index];
  }
  // set input path for the first step
  process.env.INPUT_PATH = `${uploadDirectory}${run_id}/`;
  // disabling no-restricted-syntax; running each step must be done in a sequence
  for await (const step of stepDefs) {
    step_ready = true;
    // check if there is a stop signal set to true or failed run signal set
    // changed to cancel remaining steps only if the entire run is cancelled
    if (!step.stepId) throw new Error('stepId not defined');
    if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)) {
      // eslint-disable-next-line no-await-in-loop
      await sdk.setStepAsCancelled({ step_id: step.stepId });
      // eslint-disable-next-line no-await-in-loop
      await sdk.insertLog({ step_id: step.stepId, text: 'Run has been cancelled' });
      cancelled.push(step.step_number);
      // eslint-disable-next-line no-continue
      continue;
    }
    if (!env_list || !timeout_values) {
      throw new Error('Error! List of environment variables/ timeout values for container undefined');
    }
    // get prerequisite step numbers of the current step and verify if it can be executed at this point
    if (step.prerequisite?.length > 0) {
      for (const prereq_step of step.prerequisite) {
        // if the prereq_step is completed, add input file and continue
        if (completed.includes(prereq_step)) {
          currentStep.inputPath.push(`/app/simulations/${simulation_id}/${run_id}/${prereq_step}/outputs/`);
        } else if (failed.includes(prereq_step) || cancelled.includes(prereq_step)) { // if the prereq_step is failed/cancelled, reset input file and add it to cancelled because it cannot be executed
          // eslint-disable-next-line no-await-in-loop
          await sdk.setStepAsCancelled({ step_id: step.stepId });
          // eslint-disable-next-line no-await-in-loop
          await sdk.insertLog({ step_id: step.stepId, text: 'Step cannot be executed as a dependent step has failed/cancelled' });
          cancelled.push(step.step_number);
          step_ready = false;
          break;
        } else { // if the prereq_step is waiting, reset input file and add it to end of queue
          stepDefs.push(step);
          step_ready = false;
          break;
        }
      }
    }
    if (step_ready) {
      currentStep.image = step.image;
      currentStep.stepNumber = step.step_number;
      currentStep.stepId = step.stepId;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      currentStep.env = step.env;
      // set the variable values in env file
      process.env.STEP_NUMBER = `${step.step_number}`;
      process.env.IMAGE = step.image;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      process.env.CONTAINER_TIME_LIMIT = `${step.timeout}`;
      // adding try catch to handle failed steps
      try {
        // eslint-disable-next-line no-await-in-loop
        await controller.start(client, currentStep);
        completed.push(step.step_number); // add successful step to the completed list
      } catch (error) {
        logger.error(`Run ${run_id} execution has failed\n${(error as Error).message}`);
        process.env.FAILED_RUN = 'true';
        failed.push(step.step_number); // add failed step to the list
      }
    }
    // reset input path to the next pipeline step
    currentStep.inputPath = [];
  }
  // remove sample input files for the run from ./uploaded folder
  fs.rmSync(`${uploadDirectory}${run_id}`, { recursive: true, force: true });
  if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)) {
    // mark the run as cancelled
    logger.info(`Run ${run_id} execution is cancelled\n`);
    await sdk.setRunAsCancelled({ run_id });
    // remove current runid from CANCEL signal
    (process.env.CANCEL_RUN_LIST as string).replace(run_id, '');
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
 * function to stop an active run and cancel all its remaining steps
 */
export async function stopRun(run_id:string, userid:string):Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  // add the current runid to the environment var to denote stop signal has been sent to runid
  process.env.CANCEL_RUN_LIST = `${process.env.CANCEL_RUN_LIST as string},${run_id}`;
  return run_id;
}

/**
 * function to delete a run from the database
 */
export async function deleteRun(run_id:string, userid:string):Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  await sdk.deleteRun({ run_id });
  return run_id;
}

/**
 * function to delete a simulation from the database
 */
export async function deleteSimulation(simulation_id:string, userid:string):Promise<string> {
  // throw error if simulation does not belong to the user
  await checkSimulationOwner(simulation_id, userid);
  await sdk.deleteSimulation({ simulation_id });
  return simulation_id;
}

const taskQueue = new TaskQueue();

/**
 * the scheduler to start runs waiting in the task queue in FIFO manner
 */
async function runScheduler():Promise<void> {
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
export async function queueRun(run_id:string, userid:string):Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  if (process.env.IS_SIMULATION_RUNNING === 'true') {
    logger.info(`RunId ${run_id} added to task queue`);
  }
  taskQueue.enqueue(run_id);
  await sdk.setRunAsQueued({ run_id });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  runScheduler();
  return 'ok';
}

/**
 * function to get all details and runs of a simulation
 */
export async function getSimulation(userid:string, simulation_id:string):Promise<GetSimulationQuery> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetSimulationQuery = await sdk.getSimulation({ userid, simulation_id });
  // return JSON.stringify(result);
  return result;
}

/**
 * function to create a sample simulation for user to test
 * wip - removed creating sample simulation; testing allsimulations with userid
 */
export async function createSampleSimulation():Promise<string> {
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
