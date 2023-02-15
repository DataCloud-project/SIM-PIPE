import sdk from '../db/sdk.js';
import type RunData from './run-data.js';

export default async function markRunAsStarted(
  context: { runId: string | undefined }): Promise<RunData> {
  const { runId } = context;
  if (runId === undefined) {
    throw new Error('runId is undefined');
  }
  const data = await sdk.setRunAsStarted({ runId });
  const { updateRunsByPk } = data;
  if (!updateRunsByPk) {
    throw new Error('No run marked as started');
  }
  return updateRunsByPk;
}
