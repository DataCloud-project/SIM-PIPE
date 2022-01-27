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

dotenv.config({ path: '../.env' });

// remote is true by default
const remote:boolean = !process.argv[2] ? true : process.argv[2] === 'remote';

let docker: Docker;
let sdk;
let step_id:number;

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

type ControllerConfig = {
  simId: string | undefined,
  runId: string | undefined,
  stepNumber: string | undefined,
  image:string | undefined,
  inputPath: string | undefined,
  targetDirectory:string,
  pollingInterval:number,
  createdContainer: Docker.Container,
  counter:number,
  inputFile:string,
  remoteInputFile: string,
  remoteOutputDir:string,
  storeInputFile:string,
  storeOutputDir:string
};

const config_object:ControllerConfig = {};
let COMPLETED:boolean;

// TODO: fix env variables

function init() {
  config_object.simId = process.env.SIM_ID;
  config_object.runId = process.env.RUN_ID;
  config_object.stepNumber = process.env.STEP_NUMBER;
  config_object.image = process.env.IMAGE;
  config_object.inputPath = process.env.INPUT_PATH;

  if (!config_object.simId || !config_object.runId || !config_object.stepNumber || !config_object.image || !config_object.inputPath) {
    throw new Error('Missing environment variables: SIM_ID, RUN_ID, STEP_NUMBER, IMAGE, INPUT_PATH');
  }
  config_object.targetDirectory = path.join(config_object.simId, config_object.runId, config_object.stepNumber);
  // Polling interval for collecting stats from running container
  config_object.pollingInterval = 500;

  config_object.counter = 1;
  // config_object.inputFile = inputPath;
  config_object.remoteInputFile = 'in/input.txt';
  config_object.remoteOutputDir = 'out/';
  config_object.storeInputFile = `${config_object.targetDirectory}/input.txt`;
  // config_object.storeOutputFile = `${config_object.targetDirectory}/output.txt`;
  config_object.storeOutputDir = ${config_object.targetDirectory};
  COMPLETED = true;
}
let timer: SetIntervalAsyncTimer;

async function createContainer() : Promise<void> {
  config_object.createdContainer = (await docker.createContainer({
    Image: config_object.image,
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
  })) as unknown as Docker.Container;
  await config_object.createdContainer.start({});
  // change the step status in the database to active
  await sdk.setStepAsStarted({ step_id });
  logger.info(`Container started with ID: ${config_object.createdContainer.id}`);
}

type StatSample = {
  time: string,
  cpu: number,
  memory: number,
  memory_max: number,
  rx_value: number,
  tx_value: number
};

export async function parseStats() : Promise<void> {
  const directoryName = config_object.targetDirectory;
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
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const memory_max = fileContent.memory_stats.max_usage;
        const rx_value = fileContent.networks.eth0.rx_bytes;
        const tx_value = fileContent.networks.eth0.tx_bytes;
        sample = {
          time, cpu, memory, memory_max, rx_value, tx_value,
        };
        sdk.insertResourceUsage({
          cpu,
          memory,
          memory_max,
          rx_value,
          tx_value,
          step_id,
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

  if (!ids.includes(config_object.createdContainer.id)) {
    logger.info('Completed execution of container');
    // update the step status as ended succesfully
    sdk.setStepAsEndedSuccess({ step_id });
    stopStats();
    await setTimeout(1000); // Wait 1s before parsing the stats
    await parseStats();

    // collect logs of the stoppped container
    const stream = await container.logs({
      follow: false, stdout: true, stderr: true, // stdin: true,
    });

    const fileName = path.join(config_object.targetDirectory, 'logs.txt');
    await fsAsync.writeFile(fileName, stream);
    sdk.insertLog({ step_id, text: `${stream}` });
    // get output from sandbox
    await sftp.getFromSandbox(config_object.remoteOutputDir, config_object.storeOutputDir);
    logger.info('Collected simulation files from Sandbox');

    // clear all files created during simulation
    await sftp.clearSandbox();

    logger.info(`Stored simulation details to ${config_object.targetDirectory}`);
    // set variable COMPLETED to indicate completion of simulation
    COMPLETED = false;
  } else { // collect statstics as long as the container is running
    const stream = await container.stats({ stream: false });
    const fileName = path.join(config_object.targetDirectory,
      `stats.${config_object.counter}.json`);
    config_object.counter += 1;
    await fsAsync.writeFile(fileName, JSON.stringify(stream, undefined, ' '));
  }
}

function startStatsPolling() {
  timer = setIntervalAsync(async () => {
    try {
      await getStats(config_object.createdContainer);
    } catch (error) {
      logger.error(error);
    }
  }, config_object.pollingInterval);
}

async function waitForContainer():Promise<void> {
  while (COMPLETED === true) {
    await setTimeout(500);
  }
}

export async function start(client:GraphQLClient, stepId:number) : Promise<void> {
  init();
  sdk = getSdk(client);
  step_id = stepId;
  logger.info(`Starting simulation for step ${config_object.stepNumber}`);
  await sftp.putToSandbox(config_object.inputPath, config_object.remoteInputFile, config_object.storeInputFile);
  await createContainer();
  startStatsPolling();
  await waitForContainer();
}
