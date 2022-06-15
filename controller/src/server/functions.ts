import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import * as fs from 'node:fs';
import { setTimeout } from 'node:timers/promises';

import * as controller from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';
import TaskQueue from './taskqueue.js';
import type {
  AllSimulationsQuery, CreateRunMutation, CreateSimulationMutation,
  CreateStepMutation, GetRunDetailsQuery, GetSimulationRunResultsQuery,
} from '../db/database.js';
import type * as types from '../types.js';

dotenv.config();

let client: GraphQLClient;
let sdk: { setRunAsQueued: (argument0: { run_id: string; }) => any,
  AllSimulations: () => AllSimulationsQuery | PromiseLike<AllSimulationsQuery>,
  allRunsAndSteps: () => any,
  createSimulation: (argument0: { model_id: string; name: string; }) => CreateSimulationMutation,
  createStep: (argument0: { run_id: string; name: string; image: string; pipeline_step_number: number; }) => CreateStepMutation,
  createRun: (argument0: { simulation_id: string; dsl: string; name: string; }) => CreateRunMutation,
  setRunAsStarted: (argument0: { run_id: string; }) => any,
  getRunDetails: (argument0: { run_id: string; }) => GetRunDetailsQuery,
  getSimulationRunResults: (argument0: { simulation_id: string; run_id: string; }) => GetSimulationRunResultsQuery,
  setRunAsCancelled: (argument0: { run_id: string; }) => any,
  setStepAsCancelled: (argument0: { step_id: any; }) => any,
  setRunAsFailed: (argument0: { run_id: string; }) => any,
  setRunAsEndedSuccess: (argument0: { run_id: string; }) => any
};
const uploadDirectory = 'uploaded_files/';

export async function allSimulations():Promise<AllSimulationsQuery> {
  return await sdk.AllSimulations();
}

export async function allRunsSteps():Promise<string> {
  return JSON.stringify(await sdk.allRunsAndSteps(), undefined, 2);
}

export async function createSimulation(model_id:string, name:string):Promise<string> {
  // disabling await-thenable, await is needed for sequential execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateSimulationMutation = await sdk.createSimulation({
    model_id,
    name,
  });
  if (!result?.create_simulation?.simulation_id) {
    throw new Error('🎌 Undefined expression in createSimulation');
  }
  return result.create_simulation.simulation_id;
}

// takes in dsl from def-pipe and return the list of steps
// preloaded TLU pipeline images, TODO: parse original DSL
function parseDslTLU(dsl:string):Array<StepDSL> {
  // TODO; parse dsl argument
  const object:Array<StepDSL> = dsl === 'tlu' || dsl === '' ? [{
    name: '01-datagen-and-routing',
    step_number: 1,
    image: 'registry.sintef.cloud/tellucare-edge',
    // image: 'i1',
    env: ['MQTT_HOST=oslo.sct.sintef.no',
      'MQTT_USERNAME=TGW000000000',
      'MQTT_CLIENT_ID=TGWDATACLOUD',
      'MQTT_PASS=d47AcL0|_|D1sTh3B3St',
      'MQTT_PORT=1883'],
  }, {
    name: '02-storage-and-analytics',
    step_number: 2,
    image: 'registry.sintef.cloud/tellucare-api:latest',
    // image: 'i1',
    env: ['RABBITMQ_HOST=oslo.sct.sintef.no:5672',
      'RABBITMQ_USERNAME=tellucareapi',
      'RABBITMQ_PASSWORD=d47AcL0|_|D1sTh3B3St',
      'FHIR_URL=https://tellucloud-fhir.sintef.cloud'],
  }, {
    name: '03-application-logic',
    step_number: 3,
    image: 'registry.sintef.cloud/tellucare-application-logic:latest',
    // image: 'i1',
    env: ['FHIR_URL=https://tellucloud-fhir.sintef.cloud/',
      'RABBITMQ_HOST=oslo.sct.sintef.no:5672',
      'RABBITMQ_USERNAME=tellucareapplicationlogic',
      'RABBITMQ_PASSWORD=d47AcL0|_|D1sTh3B3St'],
  }] : [{
    name: 'step 1',
    step_number: 1,
    image: 'i1',
    env: ['STEP_NUMBER=1'],
  }, {
    name: 'step 2',
    step_number: 2,
    image: 'i1',
    env: ['STEP_NUMBER=2'],
  }, {
    name: 'step 3',
    step_number: 3,
    image: 'i1',
    env: ['STEP_NUMBER=3'],
  }];
  return object;
}

// interface for dsl step
interface StepDSL {
  name: string
  step_number: number
  image: string
  env: string[]
}

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

export async function createRun(simulation_id:string, dsl:string, name:string):Promise<string> {
  // TODO: parse dsl
  // const steps:Array<StepDSL> = parseDSL(dsl);
  // preloaded TLU pipeline
  const steps:Array<StepDSL> = parseDslTLU(dsl);
  // disabling await-thenable, await is needed to wait till sdk.createRun completes execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateRunMutation = await sdk.createRun({
    simulation_id,
    // TODO: later to parse dsl -> dsl: JSON.parse(dsl),
    dsl,
    name,
  });
  if (!result.insert_runs_one?.run_id) {
    throw new Error('🎌 Undefined results from sdk.createRun function');
  }
  // create all steps in the database
  const { run_id: runId } = result.insert_runs_one;
  logger.info(`Run created with id ${runId}`);
  // eslint-disable-next-line no-restricted-syntax
  for await (const step of steps) {
    await createStep(runId, step.name, step.image, step.step_number);
  }
  return runId;
}

export async function createRunWithInput(simulation_id: string, dsl: string,
  name: string, sampleInput: [[string, string]]): Promise<string> {
  const runId = await createRun(simulation_id, dsl, name);
  console.log('create run fn called in create run with input fn');
  fs.mkdirSync(`${uploadDirectory}${runId}`, { recursive: true });
  // write sample input to uploaded_files/runId
  // eslint-disable-next-line no-restricted-syntax
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

export async function startRun(run_id:string):Promise<string> {
  // set run as started in the database
  await sdk.setRunAsStarted({ run_id });
  // get simulationId and step details of runId
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetRunDetailsQuery = await sdk.getRunDetails({ run_id });
  const { steps } = result.runs[0]; // get steps sorted acc to pipeline_step_number
  // set runId and simulationId once for all runs
  const currentStep:types.Step = {
    simId: result.runs[0].simulation_id,
    runId: run_id,
    inputPath: `${uploadDirectory}${run_id}/`,
  };
  // set input path for the first step
  process.env.INPUT_PATH = `${uploadDirectory}${run_id}/`;
  // get env from piepeline dsl
  // preloaded TLU pipeline
  const stepsListDSL:Array<StepDSL> = parseDslTLU(typeof result.runs[0].dsl === 'string'
    ? result.runs[0].dsl
    : '');
  // disabling no-restricted-syntax; running each step must be done in a sequence
  /* eslint-disable-next-line no-restricted-syntax */
  for await (const step of steps) {
    // check if there is a stop signal set to true or failed run signal set
    if ((process.env.CANCEL_RUN_LIST as string).includes(run_id)
    || process.env.FAILED_RUN === 'true') {
      // mark all the remaining steps as cancelled
      await sdk.setStepAsCancelled({ step_id: step.step_id });
      // eslint-disable-next-line no-continue
      continue;
    }
    // testing step type
    currentStep.image = step.image;
    currentStep.stepNumber = step.pipeline_step_number;
    currentStep.stepId = step.step_id;
    // preloaded TLU pipeline
    currentStep.env = stepsListDSL[step.pipeline_step_number - 1].env;
    // set the variable values in env file
    process.env.STEP_NUMBER = `${step.pipeline_step_number}`;
    process.env.IMAGE = step.image;
    // testing step type
    // adding try catch to handle failed steps
    try {
      // set input path for next step as output path of the previous step returned and start step
      const nextInput = await controller.start(client, currentStep);
      currentStep.inputPath = nextInput;
    } catch {
      process.env.FAILED_RUN = 'true';
    }
  }
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
    logger.error(`Run ${run_id} execution has failed\n`);
    await sdk.setRunAsFailed({ run_id });
    // set STOP signal to false for the next run
    process.env.FAILED_RUN = 'false';
    return 'failed';
  }
  // set run as completed successully in the database
  await sdk.setRunAsEndedSuccess({ run_id });
  return run_id;
}

export async function getSimulationRunResults(simulation_id:string,
  run_id:string):Promise<string> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetSimulationRunResultsQuery = await
  sdk.getSimulationRunResults({ simulation_id, run_id });
  return JSON.stringify(result, undefined, 2);
}

export function stopRun(run_id:string):string {
  // add the current runid to the environment var to denote stop signal has been sent
  // to runid
  // find the current running container
  process.env.CANCEL_RUN_LIST = `${process.env.CANCEL_RUN_LIST as string},${run_id}`;
  // stop and kill current container
  // stop the start run function to stop all the next steps
  // change the status of runs and steps to 'cancelled'
  return run_id;
}

const taskQueue = new TaskQueue();

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

export async function queueRun(run_id:string):Promise<string> {
  if (process.env.IS_SIMULATION_RUNNING === 'true') {
    logger.info(`RunId ${run_id} added to task queue`);
  }
  taskQueue.enqueue(run_id);
  await sdk.setRunAsQueued({ run_id });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  runScheduler();
  return 'ok';
}

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

export async function createSampleSimulation():Promise<string> {
  await setTimeout(7000);
  let result;
  try {
    connectHasuraEndpoint();
    // check if there are simulations in the database
    result = await sdk.AllSimulations();
  } catch (error) {
    const errorMessage = `\n 🎌 Error connecting from SIM-PIPE controller to hasura endpoint:\n
    ${(error as Error).message}
    Check REMOTE_SCHEMA_URL in env file, hasura endpoint and admin secret\n`;
    logger.error(errorMessage);
    logger.info('Retrying connecting from controller to hasura endpoint after 5 seconds');
    await setTimeout(5000);
    connectHasuraEndpoint();
  }
  if (!result) { throw new Error('🎌 Error creating sample simulation at server start up'); }
  if (result.simulations.length === 0) {
    const simId = await createSimulation('c97fc83a-b0fc-11ec-b909-0242ac120002',
      'Sample Simulation');
    return `Sample simulation with id ${simId} created on startup`;
  }
  return 'No sample simulation created as there are existing simulations';
}
