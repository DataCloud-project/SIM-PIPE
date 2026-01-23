/* eslint-disable import/prefer-default-export */
import got from 'got';

import {
  mooseApiEndpoint,
  mooseApiKey,
  openRouterApiKey,
  openRouterApiKeyPAID,
  useOpenRouterPaidAPI,
  mooseLlmProvider,
  mooseLlmModel,
  mooseDpvSchema,
} from '../config.js';
import { getObjectText } from '../minio/minio.js';

interface DpvTask {
  task_id: string;
  text: string;
}

interface DpvRequestBody {
  tasks: DpvTask[];
  include_scores: boolean;
  llm: {
    provider: string;
    model: string;
  };
  schema: string;
}

function sanitizeArtifactText(text: string): string {
  if (!text) return text;

  return JSON.stringify(text).slice(1, -1);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function makeDPVCall(text: string, taskId = 'task-1'): Promise<string> {
  if (!mooseApiKey) {
    throw new Error('MOOSE_API_KEY is not configured');
  }
  const llmApiKey = useOpenRouterPaidAPI ? openRouterApiKeyPAID : openRouterApiKey;
  if (!llmApiKey) {
    throw new Error(
      useOpenRouterPaidAPI
        ? 'OPENROUTER_API_KEY_PAID is not configured'
        : 'OPENROUTER_API_KEY is not configured',
    );
  }

  //   const baseUrl = mooseApiEndpoint.replace(/\/+$/, '');
  const url = `${mooseApiEndpoint}/ner`;

  const body: DpvRequestBody = {
    tasks: [
      {
        task_id: taskId,
        text,
      },
    ],
    include_scores: false,
    llm: {
      provider: mooseLlmProvider,
      model: mooseLlmModel,
    },
    schema: mooseDpvSchema,
  };

  console.log('body:', JSON.stringify(body, null, 2));

  const response:{ body:{ job_id: string } } = await got.post(url, {
    json: body,
    responseType: 'json',
    headers: {
      accept: 'application/json',
      'X-LLM-API-Key': llmApiKey,
      'X-API-Key': mooseApiKey,
      'Content-Type': 'application/json',
    },
  });
  console.log('DPV response:', response.body);
  return response.body.job_id;
}

export async function getDPVJobResult(jobId: string): Promise<{ status?: string } & Record<string, unknown>> {
  if (!mooseApiKey) {
    throw new Error('MOOSE_API_KEY is not configured');
  }

  const url = `${mooseApiEndpoint}/jobs/${jobId}`;

  const response = await got.get(url, {
    responseType: 'json',
    headers: {
      accept: 'application/json',
      'X-API-Key': mooseApiKey,
    },
  });

  return response.body as { status?: string } & Record<string, unknown>;
}

export async function getDPVJobResultPolling(
  artifactUrl: string,
  pollingIntervalMs = 4000,
  maxAttempts = 80,
): Promise<unknown> {
// Parse the Minio bucket and object key from the public artifact URL,
  // then fetch the content via the internal Minio client (not localhost).
  const url = new URL(artifactUrl);
  const pathParts = url.pathname.replace(/^\/+/, '').split('/');
  const bucketName = pathParts.shift()!; // e.g. "artifacts"
  const objectName = pathParts.join('/');

  const artifactText = await getObjectText(objectName, bucketName);
  // Start Moose DPV job with the artifact text
  const jobId = await makeDPVCall(artifactText);

  let attempt = 0;

  // Simple polling loop: re-check status every pollingIntervalMs while it's "processing".
  // Stops when status changes (e.g. to "completed" or an error state) or when maxAttempts is reached.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const result = await getDPVJobResult(jobId);
    if (result.status === 'completed' || result.status === 'failed') {
      console.log('DPV job polling result:', result);
      return result;
    }
    console.log('Polling attempt', attempt);
    attempt += 1;
    if (attempt >= maxAttempts) {
      throw new Error(`DPV job ${jobId} did not reach status 'completed' or 'failed' after ${maxAttempts} attempts`);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, pollingIntervalMs);
    });
  }
}
