import { assertRunDataWithVolumes } from './run-data.js';
import type RunData from './run-data.js';

export default async function loadNextStep(
  context: { runData: RunData | undefined },
): Promise<RunData> {
  assertRunDataWithVolumes(context);
  const { runData } = context;

  // Find the next step to run, which is the first one that as a status WAITING
  const nextStep = runData.steps.find((step) => step.status === 'WAITING');

  return {
    ...runData,
    currentStep: nextStep,
  };
}
