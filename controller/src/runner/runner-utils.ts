import { setTimeout } from 'node:timers/promises';
import type Docker from 'dockerode';
import type { Stream } from 'node:stream';

import { runnerContainerStopTimeout } from '../config.js';
import docker from './docker.js';
import type { Step, UUID } from '../types.js';

export async function pullImage(image: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const onFinished = (): void => {
      resolve();
    };
    docker.pull(image, {}, (error: unknown, stream: Stream) => {
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
    });/* .catch((error) => {
      reject(error);
    }); */
  });
}

export async function pullAllImages(images: string[]): Promise<void> {
  await Promise.all(images.map((image) => pullImage(image)));
}

// Ping docker deamon to check if it is running
export async function pingRunner(): Promise<void> {
  const pingResult = await Promise.race<string | unknown>([
    setTimeout(5000, 'timeout'),
    docker.ping(),
  ]);
  if (pingResult === 'timeout') {
    throw new Error('ping timeout');
  }
}

// Create a volume for a run
// Returns the name of the volume in a promise
export async function createVolume({
  userId, simulationId, runId, type, number, stepId,
}: {
  userId: string;
  simulationId: UUID;
  runId: UUID;
  type: 'input' | 'output' | 'work' | 'shared';
  stepId?: UUID;
  number?: number;
}): Promise<string> {
  let name: string;
  if (stepId !== undefined) {
    if (type !== 'work' || number !== undefined) {
      throw new Error('stepId is only valid for work volumes');
    }
    name = `simpipe-${runId}-${type}-${stepId}`;
  } else if (type === 'work' || type === 'shared') {
    if (number === undefined) {
      throw new Error('number is required for work or shared volumes');
    }
    name = `simpipe-${runId}-${type}-${number}`;
  } else {
    if (number !== undefined) {
      throw new Error('number is only valid for work or shared volumes');
    }
    name = `simpipe-${runId}-${type}`;
  }

  const response = await docker.createVolume({
    Name: name,
    Labels: {
      user_id: userId,
      simulation_id: simulationId,
      run_id: runId,
    },
    // dockerode types are wrong again
    // TODO make a pull request to fix this
  }) as unknown as { name: string };

  return response.name;
}

export async function createContainer({
  step, inputVolume, outputVolume, workVolume,
}: {
  step: Step, inputVolume: string, outputVolume: string, workVolume: string
},
): Promise<Docker.Container> {
  const environment: string[] = step.env
    ? Object.entries(step.env).map(([key, value]) => `${key}=${value}`)
    : [];

  // Check that the volume names are valid just in case
  for (const volumeName of [inputVolume, outputVolume, workVolume]) {
    if (!/^[\dA-Za-z][\w.-]*$/.test(volumeName)) {
      throw new Error(`Invalid volume name: ${volumeName}`);
    }
  }

  const binds = [
    `/var/lib/docker/volumes/${inputVolume}/_data:/app/in`,
    `/var/lib/docker/volumes/${outputVolume}/_data:/app/out`,
    `/var/lib/docker/volumes/${workVolume}/_data:/app/work`,
  ];

  return await docker.createContainer({
    name: step.stepId,
    Labels: {
      user_id: step.userId,
      simulation_id: step.simulationId,
      run_id: step.runId,
      step_id: step.stepId,
      step_number: step.stepNumber.toString(),
    },
    Image: step.image,
    Volumes: {},
    // Volume specified in docker createcontainer function using Binds parameter
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore - Binds is missing from ContainerCreateOptions type
    // the as unknown as Docker.Container is also related to this mess
    // TODO make a pull request there to add the Binds type
    // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/dockerode
    Binds: binds,
    StopTimeout: runnerContainerStopTimeout,
    Env: environment,
    Tty: true,
    AttachStdout: true,
    AttachStderr: true,
  }) as unknown as Docker.Container;
  // The cast is because of the Binds issue
}
