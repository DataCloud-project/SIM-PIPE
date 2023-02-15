import { setTimeout } from 'node:timers/promises';

export default async function markRunAsRunningAndStepsAsScheduled(
  context: { runId: string }): Promise<void> {
  console.log(context.runId);
  await setTimeout(1000);
}
