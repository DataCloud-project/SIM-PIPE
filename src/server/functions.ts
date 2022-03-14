/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-restricted-syntax */
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';
import * as fs from 'node:fs';

import * as controller from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';
import type * as types from '../types.js';

dotenv.config();

const hasura = process.env.HASURA ?? 'http://127.0.0.1:8080/v1/graphql';
const client = new GraphQLClient(hasura, {
  headers: {
    'x-hasura-admin-secret': 'hasuraadminsecret',
  },
});
const sdk = getSdk(client);
const uploadDirectory = 'uploaded_files/';

export async function allSimulations():Promise<string> {
  return JSON.stringify(await sdk.AllSimulations(), undefined, 2);
}

export async function allRunsSteps():Promise<string> {
  return JSON.stringify(await sdk.allRunsAndSteps(), undefined, 2);
}

export async function createSimulation(model_id:string, name:string):Promise<string> {
  const result = await sdk.createSimulation({
    model_id,
    name,
  });
  if (!result?.create_simulation?.simulation_id) {
    throw new Error('Undefined expression in createSimulation');
  }
  return result.create_simulation.simulation_id;
}

// takes in dsl from def-pipe and return the list of steps
// TLU pipeline images, TODO: parse original DSL
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
  // env: [string]
  env: string[]
}

export async function createStep(run_id:string, name:string, image:string,
  pipeline_step_number:number):Promise<string> {
  const result = await sdk.createStep({
    run_id,
    name,
    image,
    pipeline_step_number,
  });
  if (!result.insert_steps_one?.step_id) {
    throw new Error('Undefined results from createStep');
  }
  logger.info(`Step created with id ${result.insert_steps_one.step_id}`);
  return `${result.insert_steps_one.step_id}`;
}

export async function createRun(simulation_id:string, dsl:string, name:string):Promise<string> {
  // TODO: parse dsl
  // const steps:Array<StepDSL> = parseDSL(dsl);
  // TLU pipeline
  const steps:Array<StepDSL> = parseDslTLU(dsl);
  const result = await sdk.createRun({
    simulation_id,
    // dsl: JSON.parse(dsl),
    dsl,
    name,
  });
  if (!result.insert_runs_one?.run_id) {
    throw new Error('Undefined results from createRun function');
  }
  logger.info(`Run created with id ${result.insert_runs_one.run_id}`);
  // create all steps in the database
  const { run_id: runId } = result.insert_runs_one;
  for await (const step of steps) {
    await createStep(runId, step.name, step.image, step.step_number);
  }
  return runId;
}

export async function createRunWithInput(simulation_id: string, dsl: string,
  name: string, sampleInput: [[string, string]]): Promise<string> {
  const runId = await createRun(simulation_id, dsl, name);
  fs.mkdirSync(`${uploadDirectory}${runId}`, { recursive: true });
  // write sample input to uploaded_files/runId
  for (const [inputName, inputContent] of sampleInput) {
    if (!inputContent) {
      throw new Error('Content of input file undefined in createRunWithInput');
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
  // const result = await sdk.getSimulationIdandSteps({ run_id });
  const result = await sdk.getRunDetails({ run_id });
  const { steps } = result.runs[0]; // get steps sorted acc to pipeline_step_number
  // testing step type
  // set runId and simulationId once for all runs
  const currentStep:types.Step = {
    simId: result.runs[0].simulation_id,
    runId: run_id,
    inputPath: `${uploadDirectory}${run_id}/`,
  };
  // set input path for the first step
  process.env.INPUT_PATH = `${uploadDirectory}${run_id}/`;
  // get env from piepeline dsl
  // TLU pipeline
  const stepsListDSL:Array<StepDSL> = parseDslTLU(result.runs[0].dsl);
  // run each step
  for await (const step of steps) {
    // check if there is a stop signal set to true
    if (process.env.CANCEL_RUN === 'true' || process.env.FAILED_RUN === 'true') {
      // mark all the remaining steps as cancelled
      await sdk.setStepAsCancelled({ step_id: step.step_id });
      // eslint-disable-next-line no-continue
      continue;
    }
    // testing step type
    currentStep.image = step.image;
    currentStep.stepNumber = step.pipeline_step_number;
    currentStep.stepId = step.step_id;
    // TLU pipeline
    currentStep.env = stepsListDSL[step.pipeline_step_number - 1].env;
    // set the variable values in env file
    process.env.STEP_NUMBER = `${step.pipeline_step_number}`;
    process.env.IMAGE = step.image;
    // set input path for next step as output path of the previous step returned and start step
    // process.env.INPUT_PATH = await controller.start(client, step.step_id);
    // testing step type
    // adding try catch to handle failed steps
    try {
      const nextInput = await controller.start(client, currentStep);
      currentStep.inputPath = nextInput;
    } catch {
      process.env.FAILED_RUN = 'true';
    }
  }
  if (process.env.CANCEL_RUN === 'true') {
    // mark the run as cancelled
    logger.info(`Run ${run_id} execution is cancelled\n`);
    await sdk.setRunAsCancelled({ run_id });
    // set STOP signal to false for the next run
    process.env.CANCEL_RUN = 'false';
    return 'cancelled';
  } if (process.env.FAILED_RUN === 'true') {
    // mark the run as failed
    logger.info(`Run ${run_id} execution has failed\n`);
    await sdk.setRunAsFailed({ run_id });
    // set STOP signal to false for the next run
    process.env.FAILED_RUN = 'false';
    return 'failed';
  }
  // set run as completed successully in the database
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sdk.setRunAsEndedSuccess({ run_id });
  return run_id;
}

export async function getSimulationRunResults(simulation_id:string,
  run_id:string):Promise<string> {
  const result = await sdk.getSimulationRunResults({ simulation_id, run_id });
  return JSON.stringify(result, undefined, 2);
}

export function stopRun(run_id:string):string {
  // find the current running container
  process.env.CANCEL_RUN = 'true';
  // stop and kill current container
  // stop the start run function to stop all the next steps
  // change the status of runs and steps to 'cancelled'
  // delete resource usage and logs ?
  return run_id;
}
