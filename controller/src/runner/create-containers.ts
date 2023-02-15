import type Docker from 'dockerode';

import { runnerContainerStopTimeout } from '../config.js';
import getDocker from './docker.js';
import { assertRunDataWithVolumes } from './run-data.js';
import type { UUID } from '../types.js';
import type { StepWithVolume } from './run-data.js';
import type RunData from './run-data.js';

async function createContainer({
  step, userId, simulationId, runId,
}: {
  step: StepWithVolume;
  userId: UUID;
  simulationId: UUID;
  runId: UUID;
}): Promise<Docker.Container> {
  const docker = await getDocker();
  const environment: string[] = step.envs.map(({ name, value }) => {
    if (name.includes('=')) {
      throw new Error(`Invalid environment variable name: ${name}`);
    }
    return `${name}=${value}`;
  });

  const { input: inputVolume, output: outputVolume, work: workVolume } = step.volumes;

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
      user_id: userId,
      simulation_id: simulationId,
      run_id: runId,
      step_id: step.stepId,
      step_number: step.pipelineStepNumber.toString(),
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

export default async function createContainers(
  context: { runData: RunData | undefined }): Promise<void> {
  assertRunDataWithVolumes(context);

  const { runData } = context;
  const { runId, steps } = runData;
  const { simulation } = runData;
  const { userId, simulationId } = simulation;

  // Then we create the containers, but we don't start them yet.
  // We want to fail fast before running them if something
  // is wrong with the containers.
  await Promise.all(steps.map(
    (step) => createContainer({
      step,
      userId,
      simulationId,
      runId,
    }),
  ));
}
