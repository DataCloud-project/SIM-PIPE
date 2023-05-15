import type { UUID } from '../types.js';

export enum SimpipeStepStatusEnum {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Waiting = 'WAITING',
}

export interface Step {
  stepId: UUID;
  name: string;
  image: string;
  timeout: number;
  status: SimpipeStepStatusEnum;
  pipelineStepNumber: number;
  envs: Array<{ name: string, value: string }>;
  volumes?: StepVolume;
}

interface StepVolume {
  input: string;
  output: string;
  work: string;
}

export interface StepWithVolume extends Step {
  volumes: StepVolume;
}

export default interface RunData {
  runId: UUID;
  name: string;
  simulation: {
    simulationId: UUID;
    name: string;
    userId: string;
  };
  steps: Array<Step>;
  currentStep?: StepWithVolume;
}

interface RunDataWithVolumes extends RunData {
  steps: Array<StepWithVolume>;
}

interface RunDataWithCurrentStep extends RunData {
  currentStep: StepWithVolume;
}

export function assertRunData(
  context: { runData: RunData | undefined },
): asserts context is { runData: RunData } {
  if (!context.runData) {
    throw new Error('runData is undefined');
  }
}

export function assertRunDataWithVolumes(
  context: { runData: RunData | undefined },
): asserts context is { runData: RunDataWithVolumes } {
  if (!context.runData) {
    throw new Error('runData is undefined');
  }
  for (const step of context.runData.steps) {
    if (!step.volumes) {
      throw new Error('step.volumes is undefined');
    }
  }
}

export function assertRunDataWithCurrentStep(
  context: { runData: RunData | undefined },
): asserts context is { runData: RunDataWithCurrentStep } {
  if (!context.runData) {
    throw new Error('runData is undefined');
  }
  if (!context.runData.currentStep) {
    throw new Error('runData.currentStep is undefined');
  }
}
