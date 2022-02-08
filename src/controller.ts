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

dotenv.config();

// remote is true by default
const remote:boolean = !process.argv[2] ? true : process.argv[2] === 'remote';

let docker: Docker;
let sdk: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setStepAsStarted: any; insertResourceUsage: any; setStepAsEndedSuccess: any; insertLog: any;
};
let stepId:number;

if (remote) {
  // remote connection to docker daemon
  docker = new Docker({
    host: '127.0.0.1',
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

let simId: string | undefined;
let runId: string | undefined;
let stepNumber: string | undefined;
let image:string | undefined;
let inputPath: string | undefined;
let targetDirectory:string;
let pollingInterval:number;
let createdContainer: Docker.Container;
let counter:number;
let remoteInputFolder: string;
let remoteOutputDirectory:string;
let COMPLETED:boolean;

function init():void {
  simId = process.env.SIM_ID;
  runId = process.env.RUN_ID;
  stepNumber = process.env.STEP_NUMBER;
  image = process.env.IMAGE;
  inputPath = process.env.INPUT_PATH;
  if (!simId || !runId || !stepNumber || !image
    || !inputPath) {
    throw new Error('Missing environment variables in controller: '
    + 'SIM_ID, RUN_ID, STEP_NUMBER, IMAGE, or INPUT_PATH');
  }
  // eslint-disable-next-line max-len
  targetDirectory = path.join(simId, runId, stepNumber);
  // Polling interval for collecting stats from running container
  pollingInterval = 750;

  counter = 1;
  remoteInputFolder = 'in/';
  remoteOutputDirectory = 'out/';
  // config_object.storeOutputFile = `${config_object.targetDirectory}/output.txt`;
  // config_object.targetDir = `${config_object.targetDirectory}`;
  COMPLETED = true;
}
let timer: SetIntervalAsyncTimer;

async function createContainer() : Promise<void> {
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
    // Env: [
    //   `STEP_NUMBER=${stepNumber}`,
    // ],
  })) as unknown as Docker.Container;
  await createdContainer.start({});
  // change the step status in the database to active
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  await sdk.setStepAsStarted({ step_id: stepId });
  logger.info(`Container started with ID: ${createdContainer.id}`);
}

type StatSample = {
  time: string,
  cpu: number,
  memory: number,
  memory_max: number,
  rxValue: number,
  txValue: number
};

export async function parseStats() : Promise<void> {
  const directoryName = targetDirectory;
  const fileList = await fsAsync.readdir(directoryName);

  // Load all the files in parallel
  const stats = await Promise.all(fileList
    // Only load files following the stats.${counter}.json pattern
    .filter((fileName) => /^stats\.\d+\.json$/.test(fileName))
    .map(async (fileName) => {
      const fullFilename = path.join(directoryName, fileName);
      const data = await fsAsync.readFile(fullFilename, { encoding: 'utf-8' });

      let sample: StatSample;
      try {
        const fileContent = JSON.parse(data) as {
          read: string;
          cpu_stats: {
            cpu_usage: {
              total_usage: number;
            };
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
        const memory = fileContent.memory_stats.usage;
        const memoryMax = fileContent.memory_stats.max_usage;
        const rxValue = fileContent.networks.eth0.rx_bytes;
        const txValue = fileContent.networks.eth0.tx_bytes;
        sample = {
          time, cpu, memory, memory_max: memoryMax, rxValue, txValue,
        };
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        await sdk.insertResourceUsage({
          cpu,
          memory,
          memory_max: memoryMax,
          rx_value: rxValue,
          tx_value: txValue,
          step_id: stepId,
          time,
        });
      } catch (error) {
        logger.error(`Error parsing stats file: ${fullFilename}`);
        logger.error(error);
        return undefined;
      }
      // Delete temporary stat file after extracting required values
      await fsAsync.unlink(fullFilename);
      return sample;
    }));

  const definedStats = stats.filter((stat) : stat is StatSample => stat !== undefined);

  // We need to sort the stats by timestamp because we read them in parallel
  const sortedStats = definedStats.sort((a, b) => a.time.localeCompare(b.time));

  const json = JSON.stringify(sortedStats, undefined, ' ');
  await fsAsync.appendFile(path.join(directoryName, 'statistics.json'), json);
}

function stopStats() : void {
  clearIntervalAsync(timer).catch((error) => {
    logger.error(error);
  });
}

export default async function getStats(container: Docker.Container) : Promise<void> {
  // if container stops, then stop the timer
  const containers = await docker.listContainers();
  const ids = containers.map((containerInList) => containerInList.Id);

  if (!ids.includes(createdContainer.id)) {
    logger.info('Completed execution of container');
    // update the step status as ended succesfully
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await sdk.setStepAsEndedSuccess({ step_id: stepId });
    stopStats();
    await setTimeout(1000); // Wait 1s before parsing the stats
    await parseStats();

    // collect logs of the stoppped container
    const logStream = await container.logs({
      follow: false, stdout: true, stderr: true, // stdin: true,
    });

    const fileName = path.join(targetDirectory, 'logs.txt');
    await fsAsync.writeFile(fileName, JSON.stringify(logStream, undefined, ' '));
    // TODO: check if logstream text is readable
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    await sdk.insertLog({ step_id: stepId, text: JSON.stringify(logStream, undefined, ' ') });
    // get output from sandbox
    await sftp.getFromSandbox(remoteOutputDirectory,
      `${targetDirectory}/outputs`);
    logger.info('Collected simulation files from Sandbox');

    // clear all files created during simulation
    await sftp.clearSandbox();

    logger.info(`Stored simulation details to ${targetDirectory}`);
    // set variable COMPLETED to indicate completion of simulation
    COMPLETED = false;
  } else { // collect statstics as long as the container is running
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    // container.stats({ stream: false }).then((data) => {
    //   // eslint-disable-next-line @typescript-eslint/no-floating-promises
    //   fsAsync.writeFile(path.join(targetDirectory,
    //     `stats.${counter}.json`), JSON.stringify(data, undefined, ' '));
    //   counter += 1;
    // });
    const stream = await container.stats({ stream: false });
    const fileName = path.join(targetDirectory,
      `stats.${counter}.json`);
    counter += 1;
    await fsAsync.writeFile(fileName, JSON.stringify(stream, undefined, ' '));
  }
}

function startStatsPolling():void {
  timer = setIntervalAsync(async () => {
    try {
      await getStats(createdContainer);
    } catch (error) {
      logger.error(error);
    }
  }, pollingInterval);
}

async function waitForContainer():Promise<void> {
  while (COMPLETED === true) {
    // eslint-disable-next-line no-await-in-loop
    await setTimeout(500);
  }
}

export async function start(client:GraphQLClient, stepIdReceived:number) : Promise<string> {
  init();
  sdk = getSdk(client);
  stepId = stepIdReceived;
  if (!inputPath || !stepNumber) {
    throw new Error('Invalid expression in controller.start');
  }
  logger.info(`Starting simulation for step ${stepNumber}`);
  await sftp.putFolderToSandbox(inputPath, remoteInputFolder, targetDirectory);
  await createContainer();
  startStatsPolling();
  await waitForContainer();
  return `${targetDirectory}/outputs/`;
}
