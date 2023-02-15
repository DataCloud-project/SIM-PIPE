import type { UUID } from 'types.js';

import getDocker from './docker.js';
import { assertRunData } from './run-data.js';
import type { Step, StepWithVolume } from './run-data.js';
import type RunData from './run-data.js';

// Create a volume for a run
// Returns the name of the volume in a promise
async function createVolume({
  userId, simulationId, runId, type, number, stepId,
}: {
  userId: string;
  simulationId: UUID;
  runId: UUID;
  type: 'input' | 'output' | 'work' | 'shared';
  stepId?: UUID;
  number?: number;
}): Promise<string> {
  const docker = await getDocker();
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

function linkVolumesToSteps({
  steps, firstInputVolume, lastOutputVolume, workVolumes, sharedVolumes,
}: {
  steps: Step[],
  firstInputVolume: string, lastOutputVolume: string, workVolumes: string[], sharedVolumes: string[]
}): StepWithVolume[] {
  const stepsWithVolumes: StepWithVolume[] = [];

  let inputVolume = firstInputVolume;
  let outputVolume: string;
  let workVolume: string;
  let index = 0;
  for (const step of steps) {
    workVolume = workVolumes[index];
    outputVolume = (index === steps.length - 1) ? lastOutputVolume : sharedVolumes[index];
    stepsWithVolumes.push({
      ...step,
      volumes: {
        input: inputVolume,
        output: outputVolume,
        work: workVolume,
      },
    });
    inputVolume = outputVolume;
    index += 1;
  }

  return stepsWithVolumes;
}

export default async function createVolumes(
  context: { runData: RunData | undefined },
): Promise<RunData> {
  assertRunData(context);

  const { runData } = context;
  const { runId, steps } = runData;
  const { simulation } = runData;
  const { userId, simulationId } = simulation;

  // Assert that the steps are sorted by pipelineStepNumber in ascending order
  for (let index = 0; index < steps.length - 1; index += 1) {
    if (steps[index].pipelineStepNumber > steps[index + 1].pipelineStepNumber) {
      throw new Error('Steps are not sorted by pipelineStepNumber');
    }
  }

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

  return {
    ...runData,
    steps: stepsWithVolumes,
  };
}
