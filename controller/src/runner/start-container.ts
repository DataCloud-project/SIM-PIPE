import getDocker from './docker.js';
import { assertRunDataWithCurrentStep } from './run-data.js';
import type RunData from './run-data.js';

export default async function startContainer(
  context: { runData: RunData | undefined }): Promise<void> {
  assertRunDataWithCurrentStep(context);
  const docker = await getDocker();
  const container = docker.getContainer(context.runData.currentStep.stepId);
  await container.start();
}
