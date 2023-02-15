import sdk from '../db/sdk.js';

export default async function markRunAsFailed(
  context: { runId: string | undefined }): Promise<void> {
  const { runId } = context;
  if (runId === undefined) {
    throw new Error('runId is undefined');
  }
  await sdk.setRunAsFailed({ runId });
}
