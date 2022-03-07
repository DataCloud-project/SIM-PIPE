// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-await-in-loop */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-restricted-syntax */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable space-in-parens */
import Docker from 'dockerode';
import * as dotenv from 'dotenv';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { clearIntervalAsync } from 'set-interval-async';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import type { GraphQLClient } from 'graphql-request';
import type { SetIntervalAsyncTimer } from 'set-interval-async';

import { getSdk } from './db/database.js';
import logger from './logger.js';
import * as sftp from './sftp-utils.js';
import type * as types from './types.js';

dotenv.config();

// TODO: remove global variables

// remote is true by default
const remote:boolean = !process.argv[2] ? true : process.argv[2] === 'remote';

let docker: Docker;
let sdk: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStepAsStarted: any; insertResourceUsage: any; setStepAsEndedSuccess: any; insertLog: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStepAsCancelled: any;
};

if (remote) {
  // remote connection to docker daemon
  docker = new Docker({
    // host: '127.0.0.1',
    host: process.env.SANDBOX_IP, // ip address of windows host
    port: 2375,
  });
} else {
  // local connection to docker dameon
  const socket = process.env.DOCKER_SOCKET || '/var/run/docker.sock';
  const stats = await fsAsync.stat(socket);

  if (!stats.isSocket()) {
    throw new Error('Are you sure the docker is running?');
  }

  docker = new Docker({ socketPath: socket });
}

let targetDirectory:string;
let createdContainer: Docker.Container;
let counter:number;

function init(step:types.Step):void {
  if (!step.stepNumber) {
    throw new Error('Error in controller.init: step number not defined');
  }
  targetDirectory = path.join('simulations', step.simId, step.runId, `${step.stepNumber}`);
  counter = 1;
  process.env.PROCESS_COMPLETED = 'false';
  process.env.STOP_SIGNAL_SENT = 'false';
}
let timer: SetIntervalAsyncTimer;

// eslint-disable-next-line unicorn/prevent-abbreviations
async function startContainer(image:string, stepId:number, env: string[]) : Promise<number> {
  createdContainer = (await docker.createContainer({
    Image: image,
    Tty: true,
    // Volume specified in docker createcontainer function using Binds parameter
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Binds is missing from ContainerCreateOptions type
    // the as unknown as Docker.Container is also related to this mess
    // TODO make a pull request there to add the Binds type
    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/dockerode
    Binds: [
      '/var/lib/docker/volumes/volume_vm/_data/in:/app/in',
      '/var/lib/docker/volumes/volume_vm/_data/out:/app/out',
      '/var/lib/docker/volumes/volume_vm/_data/work:/app/work',
    ],
    StopTimeout: process.env.CONTAINER_STOP_TIMEOUT ? +process.env.CONTAINER_STOP_TIMEOUT : 5,
    Env: env || [],
  })) as unknown as Docker.Container;
  await createdContainer.start({});
  const startedAt:number = new Date() as unknown as number;
  // change the step status in the database to active
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await sdk.setStepAsStarted({ step_id: stepId });
  logger.info(`Container started with ID: ${createdContainer.id}`);
  return startedAt;
}

export async function parseStats(stepId:number) : Promise<void> {
  const directoryName = targetDirectory;
  const fileList = await fsAsync.readdir(directoryName);

  // Load all the files in parallel
  const stats = await Promise.all(fileList
    // Only load files following the stats.${counter}.json pattern
    .filter((fileName) => /^stats\.\d+\.json$/.test(fileName))
    .map(async (fileName) => {
      const fullFilename = path.join(directoryName, fileName);
      const data = await fsAsync.readFile(fullFilename, { encoding: 'utf-8' });

      let sample: types.StatSample;
      try {
        const fileContent = JSON.parse(data) as {
          read: string;
          cpu_stats: {
            cpu_usage: {
              total_usage: number;
            };
            system_cpu_usage: number;
          };
          memory_stats: {
            usage: number;
            max_usage: number;
          };
          networks: {
            eth0: {
              rx_bytes: number;
              tx_bytes: number;
            };
          };
        };

        if (fileContent.read.startsWith('0001-01-01T00:00:00Z')) {
          // Delete stats file with null values
          await fsAsync.unlink(fullFilename);
          return undefined;
        }

        const time = fileContent.read;
        const cpu = fileContent.cpu_stats.cpu_usage.total_usage;
        const systemCpu = fileContent.cpu_stats.system_cpu_usage;
        const memory = fileContent.memory_stats.usage;
        const memoryMax = fileContent.memory_stats.max_usage;
        const rxValue = fileContent.networks.eth0.rx_bytes;
        const txValue = fileContent.networks.eth0.tx_bytes;
        sample = {
          time, cpu, systemCpu, memory, memory_max: memoryMax, rxValue, txValue,
        };
      } catch (error) {
        logger.error(`Error parsing stats file: ${fullFilename}`);
        logger.error(error);
        return undefined;
      }
      // Delete temporary stat file after extracting required values
      await fsAsync.unlink(fullFilename);
      return sample;
    }));

  const definedStats = stats.filter((stat) : stat is types.StatSample => stat !== undefined);

  // We need to sort the stats by timestamp because we read them in parallel
  const sortedStats = definedStats.sort((a, b) => a.time.localeCompare(b.time));

  // test: adding cpu percentage
  let previousCpu = 0;
  let previousSystemCpu = 0;
  // eslint-disable-next-line @typescript-eslint/no-shadow
  for await ( const stats of sortedStats ) {
    const temporary = stats.cpu;
    stats.cpu = ((stats.cpu - previousCpu) / (stats.systemCpu - previousSystemCpu));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await sdk.insertResourceUsage({
      cpu: stats.cpu,
      memory: stats.memory,
      memory_max: stats.memory_max,
      rx_value: stats.rxValue,
      tx_value: stats.txValue,
      step_id: stepId,
      time: stats.time,
    });
    previousCpu = temporary;
    previousSystemCpu = stats.systemCpu;
  }

  const json = JSON.stringify(sortedStats, undefined, ' ');
  await fsAsync.appendFile(path.join(directoryName, 'statistics.json'), json);
}

function stopPollingStats() : void {
  clearIntervalAsync(timer).catch((error) => {
    logger.error(error);
  });
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
async function postExitProcessing(container: Docker.Container, stepId:number, stepNumber:number) {
  const result = await createdContainer.inspect();
  // update the step status as ended succesfully
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await sdk.setStepAsEndedSuccess({
    step_id: stepId,
    started: result.State.StartedAt,
    ended: result.State.FinishedAt,
  });
  await setTimeout(1000); // Wait 1s before parsing the stats
  await parseStats(stepId);
  // collect logs of the stoppped container
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const logStream = `${await container.logs({
    follow: false, stdout: true, stderr: true,
  })}`;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await sdk.insertLog({ step_id: stepId, text: logStream });
  // get output from sandbox
  const remoteOutDirectory = process.env.REMOTE_OUTPUT_DIR ?? 'out/';
  await sftp.getFromSandbox(remoteOutDirectory,
    `${targetDirectory}/outputs`);
  logger.info('Collected simulation files from Sandbox');

  // clear all files created during simulation
  await sftp.clearSandbox();
  logger.info(`Stored simulation details to ${targetDirectory}`);
  // set variable COMPLETED to indicate completion of simulation
  process.env.PROCESS_COMPLETED = 'true';
  logger.info(`Step ${stepNumber} finished execution\n`);
}

async function getStatsUntilExit(container: Docker.Container, exitTimeout:number, startedAt:number,
  stepId:number, stepNumber:number):Promise<void> {
  // if container stops, then stop the timer
  const containers = await docker.listContainers();
  const ids = containers.map((containerInList) => containerInList.Id);

  if (ids.includes(createdContainer.id)) { // collect statstics as long as the container is running
    if (process.env.STOP_SIGNAL_SENT === 'false'
            && ( process.env.CANCEL_RUN === 'true'
                  || ((new Date() as unknown as number) - startedAt) >= exitTimeout )) {
      try {
      // for continuous steps, send stop signal after configured number of seconds
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
        createdContainer.stop();
        // set STOP_SIGNAL_SENT to true to avoid sending multiple stop signals
        process.env.STOP_SIGNAL_SENT = 'true';
        logger.info('Sent stop signal to running container');
      } catch {
        logger.error('Error stopping the container');
      }
    }
    // TODO: very slow; takes around 2 seconds
    const stream = await container.stats({ stream: false });
    const fileName = path.join(targetDirectory,
      `stats.${counter}.json`);
    counter += 1;
    await fsAsync.writeFile(fileName, JSON.stringify(stream, undefined, ' '));
  } else { // container is exited
    stopPollingStats();
    // if run is cancelled
    if (process.env.CANCEL_RUN === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await sdk.setStepAsCancelled({ step_id: stepId });
      logger.info('Step execution is cancelled');
      // clear all files created during simulation
      await sftp.clearSandbox();
      // set PROCESS_COMPLETED to indicate simulation is ready to closed
      process.env.PROCESS_COMPLETED = 'true';
    } else { // if step executed successfully
      logger.info('Completed execution of container');
      await postExitProcessing(container, stepId, stepNumber);
    }
  }
}

function startPollingStats(startedAt:number, stepId:number, stepNumber:number):void {
  let exitTimeout:number;
  // get CONTAINER_TIME_LIMIT (seconds) env variable
  if (!process.env.CONTAINER_TIME_LIMIT) {
    throw new Error('Timeout interval to stop container is not defined');
  } else {
    exitTimeout = ( +process.env.CONTAINER_TIME_LIMIT ) * 1000;
  }
  const pollingInterval:number = process.env.POLLING_INTERVAL ? +process.env.POLLING_INTERVAL * 1000
    : 750;
  timer = setIntervalAsync(async () => {
    try {
      await getStatsUntilExit(createdContainer, exitTimeout, startedAt, stepId, stepNumber);
    } catch (error) {
      logger.error(error);
    }
  }, pollingInterval);
}

async function waitForContainer():Promise<void> {
  while (process.env.PROCESS_COMPLETED === 'false') {
    await setTimeout(500);
  }
}
// testing step type
// export async function start(client:GraphQLClient, stepIdReceived:number) : Promise<string> {
export async function start(client:GraphQLClient, step:types.Step) : Promise<string> {
  if (!step.stepNumber || !step.stepId || !step.image || !step.env) {
    throw new Error('Error in controller.start: step_number, image, env or step_id not defined');
  }
  // const step:types.Step = {
  //   simId: process.env.SIM_ID,
  //   runId: process.env.RUN_ID,
  //   stepNumber: process.env.STEP_NUMBER,
  //   image: process.env.IMAGE,
  //   inputPath: process.env.INPUT_PATH,
  // };
  init(step);
  sdk = getSdk(client);
  logger.info(`Starting simulation for step ${step.stepNumber}`);
  const remoteInputFolder = process.env.REMOTE_INPUT_DIR ?? 'in/';
  await sftp.putFolderToSandbox(step.inputPath, remoteInputFolder, targetDirectory);
  const startedAt = await startContainer(step.image, step.stepId, step.env);
  startPollingStats(startedAt, step.stepId, step.stepNumber);
  await waitForContainer();
  return `${targetDirectory}/outputs/`;
}
