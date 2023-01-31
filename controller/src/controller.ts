import Docker from 'dockerode';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import type { GraphQLClient } from 'graphql-request';
import type { Stream } from 'node:stream';

import {
  dockerCaCertPath, dockerHost, dockerPort,
  dockerProtocol, dockerSocketPath, dockerTlsCertPath, dockerTlsKeyPath, remote,
} from './config.js';
import { getSdk } from './db/database.js';
import logger from './logger.js';
import type * as types from './types.js';

let docker: Docker;
let sdk: ReturnType<typeof getSdk>;

if (remote) {
  const caCert = dockerCaCertPath ? await fsAsync.readFile(dockerCaCertPath) : undefined;
  const tlsCert = dockerTlsCertPath ? await fsAsync.readFile(dockerTlsCertPath) : undefined;
  const tlsKey = dockerTlsKeyPath ? await fsAsync.readFile(dockerTlsKeyPath) : undefined;

  // remote connection to docker daemon
  docker = new Docker({
    host: dockerHost,
    port: dockerPort,
    protocol: dockerProtocol,
    ca: caCert,
    cert: tlsCert,
    key: tlsKey,
  });
} else {
  // local connection to docker dameon
  const stats = await fsAsync.stat(dockerSocketPath);

  if (!stats.isSocket()) {
    throw new Error('🎌 Are you sure the docker is running?');
  }

  docker = new Docker({ socketPath: dockerSocketPath });
}

// Ping docker deamon to check if it is running
async function pingDocker(): Promise<void> {
  try {
    const pingResult = await Promise.race<string | unknown>([
      setTimeout(5000, 'timeout'),
      docker.ping(),
    ]);
    if (pingResult === 'timeout') {
      throw new Error('ping timeout');
    }
    logger.info('🐳 Docker daemon is running');
  } catch (error) {
    logger.error('🐳 Docker daemon is not running');
    throw new Error(`🎌 Error pinging docker daemon\n${error as string}`);
  }
}
await pingDocker();

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

async function pullImagePromise(image: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const onFinished = (): void => {
      resolve();
    };
    docker.pull(image, async (error: unknown, stream: Stream) => {
      if (error) {
        reject(error);
      } else {
        try {
          docker.modem.followProgress(stream, onFinished);
        } catch (dockerModemError) {
          if ((dockerModemError as Error).name === 'TypeError') resolve();
          else reject(dockerModemError);
        }
      }
    }).catch((error) => {
      reject(error);
    });
  });
}

async function startContainer(
  image: string, stepId: string, environment: string[],
): Promise<void> {
  await pullImagePromise(image); // pull docker image before creating container
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

export default async function start(client: GraphQLClient, step: types.Step): Promise<string> {
  if (!step.stepNumber || !step.stepId || !step.image || !step.env) {
    throw new Error('🎌 Error in controller.start: step_number, image, env or step_id not defined');
  }
  try {
    init(step);
    sdk = getSdk(client);
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
