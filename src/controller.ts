import config from 'config';
import Docker from 'dockerode';
import fsAsync from 'node:fs/promises';
import path from 'node:path';
import { clearIntervalAsync } from 'set-interval-async';
import { setIntervalAsync } from 'set-interval-async/dynamic';
import type { SetIntervalAsyncTimer } from 'set-interval-async';

const remote = process.argv[2] === 'remote';
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

const simId = config.get<string>('sim_id');
const runId = config.get<string>('run_id');
const stepNumber = config.get<string>('step_number');
const targetDirectory = `./${simId}/${runId}/${stepNumber}`;
const pollingInterval = 500;

const createdContainer = (await docker.createContainer({
  Image: config.get('image'),
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

// eslint-disable-next-line no-console
console.log('Container created with ID:', createdContainer.id);

let timer: SetIntervalAsyncTimer;

async function stopStats() : Promise<void> {
  await clearIntervalAsync(timer);
}

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
          throw new Error('Invalid date');
        }

        const timestamp = fileContent.read;
        const cpu = fileContent.cpu_stats.cpu_usage.total_usage;
        const memory = fileContent.memory_stats.usage;
        // eslint-disable-next-line @typescript-eslint/naming-convention
        const memory_max = fileContent.memory_stats.max_usage;
        const net = fileContent.networks.eth0.rx_bytes;
        return {
          timestamp, cpu, memory, memory_max, net,
        };
      } catch {
        throw new Error(`error while parsing file: ${fullFilename}`);
      }
    }));

  // We need to sort the stats by timestamp because we read them in parallel
  const sortedStats = stats.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

  const json = JSON.stringify(sortedStats, undefined, ' ');
  await fsAsync.appendFile(path.join(directoryName, 'statistics.json'), json);
}

let counter = 1;

export default async function getStats(container: Docker.Container) : Promise<void> {
  // if container stops, then stop the timer
  const containers = await docker.listContainers();
  const ids = containers.map((containerInList) => containerInList.Id);

  if (!ids.includes(createdContainer.id)) {
    await stopStats();
    await parseStats();

    // collect logs of the stoppped container
    const stream = await container.logs({
      follow: false, stdout: true, stderr: true, // stdin: true,
    });

    const fileName = path.join(targetDirectory, 'logs.txt');
    await fsAsync.writeFile(fileName, stream);
    // collect statstics as long as the container is running
  } else {
    const stream = await container.stats({ stream: false });
    const fileName = path.join(targetDirectory, `stats.${counter}.json`);
    counter += 1;
    await fsAsync.writeFile(fileName, JSON.stringify(stream, undefined, ' '));
  }
}

// Start the polling
timer = setIntervalAsync(async () => {
  await getStats(createdContainer);
}, pollingInterval);
