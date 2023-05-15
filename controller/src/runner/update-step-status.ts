import sdk from '../db/sdk.js';
import getDocker from './docker.js';
import { assertRunDataWithCurrentStep, SimpipeStepStatusEnum } from './run-data.js';
import type RunData from './run-data.js';

export default async function updateStepStatus(
  context: { runData: RunData | undefined }): Promise<RunData> {
  assertRunDataWithCurrentStep(context);
  const { runData } = context;
  const { currentStep } = runData;
  const { stepId } = currentStep;

  const docker = await getDocker();
  const container = docker.getContainer(stepId);
  // get container status
  const containerInfo = await container.inspect();

  // get exit code
  const { StartedAt, FinishedAt, ExitCode } = containerInfo.State;
  const status = ExitCode === 0 ? SimpipeStepStatusEnum.Completed : SimpipeStepStatusEnum.Failed;

  // eslint-disable-next-line unicorn/prefer-ternary
  if (status === SimpipeStepStatusEnum.Completed) {
    // update step status in db
    await sdk.setStepAsEndedSuccess({
      stepId,
      started: StartedAt,
      ended: FinishedAt,
    });
  } else {
    await sdk.setStepAsFailed({ stepId });
  }

  // Replace the current step with the updated one
  const updatedStep = {
    ...currentStep,
    status,
  };
  const steps = runData.steps.map((step) => (step.stepId === stepId ? updatedStep : step));
  return {
    ...runData,
    steps,
    currentStep: updatedStep,
  };
}
