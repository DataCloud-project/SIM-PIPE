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
  CreateStepMutationVariables, GetRunDetailsQuery, GetRunDetailsQueryVariables,
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

export async function allRunsSteps():Promise<string> {
  return JSON.stringify(await sdk.allRunsAndSteps(), undefined, 2);
}

// old create simulation fn without json string arg for pipeline description
// export async function createSimulation(model_id:string, name:string):Promise<string> {
//   // disabling await-thenable, await is needed for sequential execution
//   // eslint-disable-next-line @typescript-eslint/await-thenable
//   const result:CreateSimulationMutation = await sdk.createSimulation({
//     model_id,
//     name,
//   });
//   if (!result?.create_simulation?.simulation_id) {
//     throw new Error('🎌 Undefined expression in createSimulation');
//   }
//   return result.create_simulation.simulation_id;
// }

export async function createSimulation(model_id:string, name:string, pipeline_description:string, userid:string):
Promise<string> {
  // disabling await-thenable, await is needed for sequential execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateSimulationMutation = await sdk.createSimulation({
    model_id,
    name,
    pipeline_description,
    userid,
  });
  if (!result?.create_simulation?.simulation_id) {
    throw new Error('🎌 Undefined expression in createSimulation');
  }
  // read pipeline_description and extract env variable list
  // console.log(pipeline_description);
  // console.log(pipeline_description.name);
  // console.log(pipeline_description[0].name);
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

/**
 * function to read dsl parameter in simulation table
 * WIP
 * */
// async function readDSL(simulation_id:string):Promise<void> {
//   // get dsl from simulation table using simulation_id
//   const result:GetSimulationDslQuery = await sdk.getSimulationDSL({ simulation_id });
//   // console.log(result.simulations[0].pipeline_description);
//   // validate pipeline description according to schema v1
// }

export async function createRun(simulation_id:string, dsl:string, name:string, userid:string,
  environment_list: [[string]], timeout_value: number):Promise<string> {
  // TODO: parse dsl
  // preloaded TLU pipeline
  const steps:Array<StepDSL> = parseDslTLU(dsl);
  // TODO: read dsl, validate and use it to create steps in the run
  // await readDSL(simulation_id);
  // disabling await-thenable, await is needed to wait till sdk.createRun completes execution
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:CreateRunMutation = await sdk.createRun({
    simulation_id,
    // TODO: later to parse dsl -> dsl: JSON.parse(dsl),
    dsl,
    name,
    userid,
    env_list: environment_list,
    timeout_value,
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

/**
 * function to check if a run belongs to the logged in user
 */
async function checkRunOwner(run_id:string, userid:string):Promise<void> {
  const result:GetUseridFromRunQuery = await sdk.getUseridFromRun({ run_id });
  if (result.runs[0].userid !== userid) {
    throw new Error('🎌 Invalid access; run does not belong to the user');
  }
}

/**
 * function to check if a simulation belongs to the logged in user
 */
async function checkSimulationOwner(simulation_id:string, userid:string):Promise<void> {
  const result:GetUseridFromSimulationQuery = await sdk.getUseridFromSimulation({ simulation_id });
  if (result.simulations[0].userid !== userid) {
    throw new Error('🎌 Invalid access; simulation does not belong to the user');
  }
}

export async function createRunWithInput(simulation_id: string, dsl: string,
  name: string, sampleInput: [[string, string]], userid:string, environment_list: [[string]],
  timeout_value: number): Promise<string> {
  // only owner of the simulation can create a new run
  await checkSimulationOwner(simulation_id, userid);
  const runId = await createRun(simulation_id, dsl, name, userid, environment_list, timeout_value);
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
  if (!result.runs) {
    throw new Error('GerRunDetailsQuery fetched no rows');
  }
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
    } catch (error) {
      logger.error(`Run ${run_id} execution has failed\n${(error as Error).message}`);
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

export async function stopRun(run_id:string, userid:string):Promise<string> {
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

export async function queueRun(run_id:string, userid:string):Promise<string> {
  // throw error if run does not belong to the user
  await checkRunOwner(run_id, userid);
  if (process.env.IS_SIMULATION_RUNNING === 'true') {
    logger.info(`RunId ${run_id} added to task queue`);
  }
  taskQueue.enqueue(run_id);
  await sdk.setRunAsQueued({ run_id });
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  await runScheduler();
  return 'ok';
}

/**
 * function to get all details and runs of a simulation
 */
// export async function getSimulation(userid:string, simulation_id:string):Promise<GetSimulationQuery> {
export async function getSimulation(userid:string, simulation_id:string):Promise<string> {
  // eslint-disable-next-line @typescript-eslint/await-thenable
  const result:GetSimulationQuery = await sdk.getSimulation({ userid, simulation_id });
  console.log(result);
  console.log('result from get simulation');
  return JSON.stringify(result, undefined, 2);
  // return result;
}

/**
 * function to create a sample simulation for user to test
 * wip - removed creating sample simulation; testing allsimulations with userid
 */
export async function createSampleSimulation():Promise<string> {
  await setTimeout(7000);
  // let result;
  try {
    connectHasuraEndpoint();
    // check if there are simulations in the database
    // result = await sdk.AllSimulations();
  } catch (error) {
    const errorMessage = `\n 🎌 Error connecting from SIM-PIPE controller to hasura endpoint:\n
    ${(error as Error).message}
    Check REMOTE_SCHEMA_URL in env file, hasura endpoint and admin secret\n`;
    logger.error(errorMessage);
    logger.info('Retrying connecting from controller to hasura endpoint after 5 seconds');
    await setTimeout(5000);
    connectHasuraEndpoint();
  }
  /**
   * disabling creating sample simulation, as simulations must belng to a user now
   * TODO: find alternative
   */
  // if (!result) {
  //   throw new Error('🎌 Error creating sample simulation at server start up, '
  // + 'hasura endpoint could not be connected, check hasura endpoint settings');
  // }
  // if (result.simulations.length === 0) {
  //   const simId = await createSimulation('c97fc83a-b0fc-11ec-b909-0242ac120002',
  //     'Sample Simulation');
  //   return `Sample simulation with id ${simId} created on startup`;
  // }
  // return 'No sample simulation created as there are existing simulations';
  return 'to-be-replaced';
}
