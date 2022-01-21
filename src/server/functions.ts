/* eslint-disable quote-props */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import * as dotenv from 'dotenv';
import { GraphQLClient } from 'graphql-request';

import * as controller from '../controller.js';
import { getSdk } from '../db/database.js';
import logger from '../logger.js';

dotenv.config({ path: '../../.env' });

const client = new GraphQLClient('http://127.0.0.1:8080/v1/graphql', {
  headers: {
    'x-hasura-admin-secret': 'hasuraadminsecret',
  },
});
const sdk = getSdk(client);

export async function allSimulations():Promise<string> {
  const result:string = JSON.stringify(await sdk.AllSimulations());
  return result;
}

export async function createRun(simulation_id:string, dsl:string):Promise<string> {
  const result = await sdk.createRun({
    simulation_id,
    dsl: JSON.parse(dsl),
  });
  if (!result.start_run?.run_id) {
    throw new Error('Undefined results from all_simulations');
  }
  logger.info(`Run created with id ${result.start_run.run_id}`);
  return result.start_run.run_id;
}
export async function createSimulation(model_id:string):Promise<string> {
  const result = await sdk.createSimulation({
    model_id,
  });
  return result.create_simulation?.simulation_id;
}

export async function createStep(run_id:string, name:string, image:string,
  pipeline_step_number:int):Promise<string> {
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

export async function startStep(step_id:number):Promise<string> {
  const result = await sdk.setStepAsStarted({ step_id });
  return JSON.stringify(result);
}

export async function startRun(run_id:string):Promise<string> {
  // set run as started in the database
  sdk.setRunAsStarted({ 'run_id': run_id });
  // get image, inputFilePath, stepNumber,  simulationId, runId of the task to run
  const result = await sdk.getSimulationIdandSteps({ '_eq': run_id });
  const { steps } = result.runs[0];
  // set runId and simulationId once for all runs
  process.env.RUN_ID = run_id;
  process.env.SIM_ID = result.runs[0].simulation_id;
  // sort steps according to pipeline_step_number
  steps.sort((a, b) => a.pipeline_step_number - b.pipeline_step_number);
  for await (const step of steps) {
    // set the variable values in env file
    process.env.STEP_NUMBER = step.pipeline_step_number;
    process.env.IMAGE = step.image;
    await controller.start(client, step.step_id);
    logger.info(`Step ${step.pipeline_step_number} finished execution\n`);
  }
  // set run as completed successully in the database
  sdk.setRunAsEndedSuccess({ 'run_id': run_id });
  return run_id;
}

export async function executeStepEndtoEnd(step_id: number, run_id: number):Promise<string> {
  // get image, inputFilePath, stepNumber,  simulationId, runId of the task to run

  // start the backend controller with the values above
  // set status and started columns of the step record
  // check if controller has finished execution (try catch)
  // set the status and ended fields of the step record
  return 'completed';
}
