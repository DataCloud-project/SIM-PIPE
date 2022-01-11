import Docker from 'dockerode';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { setTimeout } from 'node:timers/promises';
import { clearIntervalAsync } from 'set-interval-async';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import type { SetIntervalAsyncTimer } from 'set-interval-async';

import logger from './logger.js';
import * as sftp from './sftp-utils.js';

// remote is true by default
const remote:boolean = !process.argv[2] ? true : process.argv[2] === 'remote';

let docker: Docker;

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

const simId = process.env.SIM_ID;
const runId = process.env.RUN_ID;
const stepNumber = process.env.STEP_NUMBER;
const image = process.env.IMAGE;
const inputPath = process.env.INPUT_PATH;

if (!simId || !runId || !stepNumber || !image || !inputPath) {
  throw new Error('Missing environment variables: SIM_ID, RUN_ID, STEP_NUMBER, IMAGE, INPUT_PATH');
}
const targetDirectory = path.join(simId, runId, stepNumber);
// Polling interval for collecting stats from running container
const pollingInterval = 500;

let createdContainer: Docker.Container;
let counter = 1;
const inputFile = inputPath;
const remoteInputFile = 'in/input.txt';
const remoteOutputFile = 'out/output.txt';
const storeInputFile = `${targetDirectory}/input.txt`;
const storeOutputFile = `${targetDirectory}/output.txt`;

let timer: SetIntervalAsyncTimer;

async function createContainer() : Promise<void> {
  logger.info('Create container');
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
  })) as unknown as Docker.Container;
  await createdContainer.start({});

  logger.info(`Container created with ID: ${createdContainer.id}`);
}

type StatSample = {
  timestamp: string,
  cpu: number,
  memory: number,
  memory_max: number,
  net: number,
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
            };
          };
        };

        if (fileContent.read.startsWith('0001-01-01T00:00:00Z')) {
          // Delete stats file with null values
          await fsAsync.unlink(fullFilename);
          return undefined;
        }

        const timestamp = fileContent.read;
        const cpu = fileContent.cpu_stats.cpu_usage.total_usage;
        const memory = fileContent.memory_stats.usage;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const memory_max = fileContent.memory_stats.max_usage;
        const net = fileContent.networks.eth0.rx_bytes;
        sample = {
          timestamp, cpu, memory, memory_max, net,
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

  const definedStats = stats.filter((stat) : stat is StatSample => stat !== undefined);

  // We need to sort the stats by timestamp because we read them in parallel
  const sortedStats = definedStats.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

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
    stopStats();
    await setTimeout(1000); // Wait 1s before parsing the stats
    await parseStats();

    // collect logs of the stoppped container
    const stream = await container.logs({
      follow: false, stdout: true, stderr: true, // stdin: true,
    });

    const fileName = path.join(targetDirectory, 'logs.txt');
    await fsAsync.writeFile(fileName, stream);
    logger.info('Collected logs from Sandbox');

    // get output from sandbox
    await sftp.getFromSandbox(remoteOutputFile, storeOutputFile);

    // clear all files created during simulation
    await sftp.clearSandbox();

    logger.info(`Stored simulation details to ${targetDirectory}`);

    // collect statstics as long as the container is running
  } else {
    const stream = await container.stats({ stream: false });
    const fileName = path.join(targetDirectory, `stats.${counter}.json`);
    counter += 1;
    await fsAsync.writeFile(fileName, JSON.stringify(stream, undefined, ' '));
  }
}

function startStatsPolling() : void {
  timer = setIntervalAsync(async () => {
    try {
      await getStats(createdContainer);
    } catch (error) {
      logger.error(error);
    }
  }, pollingInterval);
}

export async function start() : Promise<void> {
  logger.info('Start simulation');
  logger.info('Copying file into sandbox');
  await sftp.putToSandbox(inputFile, remoteInputFile, storeInputFile);
  await createContainer();
  startStatsPolling();
}

// await start();
