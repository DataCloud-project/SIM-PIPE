import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import * as fs from 'node:fs';

import startController from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';
import DSL from './dsl.js';
import TaskQueue from './taskqueue.js';
import type {
  CreateRunMutation, CreateStepMutation,
  GetRunDetailsQuery,
  GetSimulationDslQuery,
  GetUseridFromRunQuery,
  GetUseridFromSimulationQuery,
} from '../db/database.js';
import type * as types from '../types.js';
import type { StepDSLType as StepDSL } from './dsl.js';

dotenv.config();

let client: GraphQLClient;
let sdk: ReturnType<typeof getSdk>;

(function connectHasuraEndpoint(): void {
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
}());

const uploadDirectory = 'uploaded_files/';

async function createStep(run_id: string, name: string, image: string,
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

async function createRun(simulation_id: string, name: string, userid: string,
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

export async function createRunWithInput(simulation_id: string,
  name: string, sampleInput: [[string, string]], userid: string, environment_list: [[string]],
  timeout_values: [number]): Promise<string> {
  // only owner of the simulation can create a new run
  await checkSimulationOwner(simulation_id, userid);
  const runId = await createRun(simulation_id, name, userid, environment_list, timeout_values);
  // Sanitize the run id to make it a safe directory name
  if (!/^[\w-]+$/.test(runId)) {
    throw new Error('Invalid run id');
  }
  fs.mkdirSync(`${uploadDirectory}${runId}`, { recursive: true });
  // write sample input to uploaded_files/runId
  for (const [inputName, inputContent] of sampleInput) {
    if (!inputContent) {
      throw new Error('Content of input file undefined in functions.createRunWithInput');
    }
    // TODO: huge security risk right there
    fs.writeFile(`${uploadDirectory}${runId}/${inputName}`, inputContent, (error) => {
      if (error) { throw new Error('Error in createRunWithInput'); }
    });
  }
  return runId;
}

async function startRun(run_id: string): Promise<string> {
  // set run as started in the database
  await sdk.setRunAsStarted({ run_id });
  // get simulationId and step details of runId
  const result: GetRunDetailsQuery = await sdk.getRunDetails({ run_id });
  if (!result.runs) {
    throw new Error('GetRunDetailsQuery fetched no rows');
  }
  // get steps, and runtime configuration entered during create run
  const { steps, env_list: environmentList, timeout_values: timeoutValues } = result.runs[0];
  // set runId and simulationId once for all runs
  const currentStep: types.Step = {
    simId: result.runs[0].simulation_id,
    runId: run_id,
    inputPath: `${uploadDirectory}${run_id}/`,
  };
  // set input path for the first step
  process.env.INPUT_PATH = `${uploadDirectory}${run_id}/`;

  for await (const step of steps) {
    // check if there is a stop signal set to true or failed run signal set
    if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)
      || process.env.FAILED_RUN === 'true') {
      // mark all the remaining steps as cancelled
      await sdk.setStepAsCancelled({ step_id: step.step_id });
    } else {
      // testing step type
      currentStep.image = step.image;
      currentStep.stepNumber = step.pipeline_step_number;
      currentStep.stepId = step.step_id;
      if (!environmentList || !timeoutValues) {
        throw new Error('Error! List of environment variables/ timeout values for container undefined');
      }
      currentStep.env = (environmentList as [[string]])[step.pipeline_step_number - 1];
      // set the variable values in env file
      process.env.STEP_NUMBER = `${step.pipeline_step_number}`;
      process.env.IMAGE = step.image;
      process.env.CONTAINER_TIME_LIMIT = `${(timeoutValues as [number])[step.pipeline_step_number - 1]}`;
      // testing step type
      // adding try catch to handle failed steps
      try {
        // set input path for next step as output path of the previous step returned and start step
        const nextInput = await startController(client, currentStep);
        currentStep.inputPath = nextInput;
      } catch (error) {
        logger.error(`Run ${run_id} execution has failed\n${(error as Error).message}`);
        process.env.FAILED_RUN = 'true';
      }
    }
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

export async function stopRun(run_id: string, userid: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  // add the current runid to the environment var to denote stop signal has been sent
  // to runid
  // find the current running container
  process.env.CANCEL_RUN_LIST = `${process.env.CANCEL_RUN_LIST as string},${run_id}`;
  // stop and kill current container
  // stop the start run function to stop all the next steps
  // change the status of runs and steps to 'cancelled'
  return run_id;
}
export async function deleteRun(run_id: string, userid: string): Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  await sdk.deleteRun({ run_id });
  return run_id;
}
export async function deleteSimulation(simulation_id: string, userid: string): Promise<string> {
  // throw error if simulation does not belong to the user
  await checkSimulationOwner(simulation_id, userid);
  await sdk.deleteSimulation({ simulation_id });
  return simulation_id;
}

const taskQueue = new TaskQueue();

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
