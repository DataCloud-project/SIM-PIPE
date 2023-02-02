import path from 'node:path';
import { setTimeout } from 'node:timers/promises';

import sdk from './db/sdk.js';
import logger from './logger.js';
import type * as types from './types.js';

let targetDirectory: string;
let createdContainer: Docker.Container;

function init(step: types.Step): void {
  if (!step.stepNumber) {
    throw new Error('🎌 Error in controller.init: step number not defined');
  }
  targetDirectory = path.join('/app/simulations', step.simulationId, step.runId, `${step.stepNumber}`);
  process.env.PROCESS_COMPLETED = 'false';
  process.env.STOP_SIGNAL_SENT = 'false';
}

async function startContainer(
  image: string, stepId: string, environment: string[],
): Promise<void> {
  await pullImage(image); // pull docker image before creating container
  createdContainer = (await docker.createContainer({
    Image: image,
    Tty: true,
    Volumes: {
      '/app/in': {},
      '/app/out': {},
      '/app/work': {},
    },
    StopTimeout: process.env.CONTAINER_STOP_TIMEOUT ? +process.env.CONTAINER_STOP_TIMEOUT : 5,
    Env: environment || [],
  })) as unknown as Docker.Container;
  await createdContainer.start({});
  // change the step status in the database to active
  await sdk.setStepAsStarted({ stepId });
  logger.info(`Container started with ID: ${createdContainer.id}`);
}

/* async function postExitProcessing(
  container: Docker.Container, stepId: string, stepNumber: number,
): Promise<void> {
  // collect logs of the stoppped container
  const logStream = await container.logs({
    follow: false, stdout: true, stderr: true,
  });
  // Convert the log Buffer to a string
  const logText = logStream.toString('utf8');
  // get output from sandbox
  const result = await createdContainer.inspect();
  const exitCode = result.State.ExitCode;
  logger.info(`Exit code ${exitCode}`);
  if (exitCode === 0) {
    await sdk.insertLog({ stepId, text: logText });
    // update the step status as ended succesfully
    await sdk.setStepAsEndedSuccess({
      stepId,
      started: result.State.StartedAt,
      ended: result.State.FinishedAt,
    });
  }
  logger.info(`Stored simulation details to ${targetDirectory}`);
  // set variable COMPLETED to indicate completion of simulation
  process.env.PROCESS_COMPLETED = 'true';
  logger.info(`Step ${stepNumber} finished execution\n`);
} */

async function waitForContainer(): Promise<void> {
  while (process.env.PROCESS_COMPLETED === 'false') {
    // eslint-disable-next-line no-await-in-loop
    await setTimeout(500);
  }
}

export default async function start(step: types.Step): Promise<string> {
  if (!step.stepNumber || !step.stepId || !step.image || !step.env) {
    throw new Error('🎌 Error in controller.start: step_number, image, env or step_id not defined');
  }
  try {
    init(step);
    logger.info(`Starting simulation for step ${step.stepNumber}`);
    // const remoteInputFolder = process.env.REMOTE_INPUT_DIR ?? 'in/';
    // await sftp.putFolderToSandbox(step.inputPath, remoteInputFolder, targetDirectory);
    await startContainer(step.image, step.stepId, step.env);
    await waitForContainer();
    const result = await createdContainer.inspect();
    if (result.State.ExitCode !== 0) {
      if (process.env.STOP_SIGNAL_SENT) {
        logger.error('Process was timed out before completion');
        throw new Error('Process was timed out before completion');
      }
      throw new Error('Exit code indicates step failed');
    }
    return `${targetDirectory}/outputs/`;
  } catch (error) {
    const message: string = error instanceof Error ? error.message : 'Error that is not an Error instance';
    // set step as failed on exception
    await sdk.setStepAsFailed({ stepId: step.stepId });
    await sdk.insertLog({ stepId: step.stepId, text: `${message}` });
    logger.error(`🎌 ${message} in controller.start`);
    throw new Error(`Error in step execution, step failed ${message}`);
  }
}
