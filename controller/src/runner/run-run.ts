import type { Step, UUID } from 'types.js';

import { createContainer, createVolume, pullAllImages } from './runner-utils.js';

function linkVolumesToSteps({
  steps, firstInputVolume, lastOutputVolume, workVolumes, sharedVolumes,
}: {
  steps: Step[],
  firstInputVolume: string, lastOutputVolume: string, workVolumes: string[], sharedVolumes: string[]
}): { step: Step, inputVolume: string, outputVolume: string, workVolume: string }[] {
  const stepsWithVolumes: {
    step: Step, inputVolume: string, outputVolume: string, workVolume: string
  }[] = [];

  let inputVolume = firstInputVolume;
  let outputVolume: string;
  let workVolume: string;
  let index = 0;
  for (const step of steps) {
    workVolume = workVolumes[index];
    outputVolume = (index === steps.length - 1) ? lastOutputVolume : sharedVolumes[index];
    stepsWithVolumes.push({
      step, inputVolume, outputVolume, workVolume,
    });
    inputVolume = outputVolume;
    index += 1;
  }

  return stepsWithVolumes;
}

export default async function runRun({
  userId, simulationId, runId, steps,
}: {
  userId: string;
  simulationId: UUID;
  runId: UUID;
  steps: Step[];
}): Promise<void> {
  // We start by pulling all the images
  const images = steps.map((step) => step.image);
  await pullAllImages(images);

  // We create the volumes first
  const firstInputVolume = await createVolume({
    userId, simulationId, runId, type: 'input',
  });
  const lastOutputVolume = await createVolume({
    userId, simulationId, runId, type: 'output',
  });
  const workVolumes = await Promise.all(steps.map((step) => createVolume({
    userId, simulationId, runId, type: 'work', stepId: step.stepId,
  })));
  const sharedVolumes = await Promise.all(Array.from({ length: steps.length - 1 })
    .map((step, index) => createVolume({
      userId, simulationId, runId, type: 'shared', number: index,
    })));

  // We need to link all the containers together as they are executed one by one
  // The output of a container is shared as the output of the next one.
  // The first container input is the input volume, the last container output is the output volume.
  // each container also a work volume that is not shared.
  const stepsWithVolumes = linkVolumesToSteps({
    steps, firstInputVolume, lastOutputVolume, workVolumes, sharedVolumes,
  });

  // Then we create the containers, but we don't start them yet.
  // We want to fail fast before running them if something
  // is wrong with the containers.
  const containers = await Promise.all(stepsWithVolumes.map(
    ({
      step, inputVolume, outputVolume, workVolume,
    }) => createContainer({
      step, inputVolume, outputVolume, workVolume,
    })));
}
