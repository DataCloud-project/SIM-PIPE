// Moose entity type for DPV results
export interface MooseEntity {
  start: number;
  end: number;
  text: string;
  type_id: string;
  confidence: number;
}
/* eslint-disable import/prefer-default-export */
import got from 'got';
import type { Query, QueryGetMooseAnalysisArgs as QueryGetMooseAnalysisArguments } from 'server/schema.js';

import {
  mooseApiEndpoint,
  mooseApiKey,
  mooseDpvSchema,
  mooseLlmModel,
  mooseLlmProvider,
  openRouterApiKey,
} from '../config.js';
import { getObjectText, setMooseReportForArtifact, setSotwReportForArtifact } from '../minio/minio.js';

interface DpvRequestBody {
  tasks: { task_id: string; text: string; }[];
  include_scores: boolean;
  llm: {
    provider: string;
    model: string;
  };
  schema: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function makeDPVCall(text: string, taskId = 'task-1'): Promise<string> {
  if (!mooseApiKey) {
    throw new Error('MOOSE_API_KEY is not configured');
  }
  if (!openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }
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

  const response: { body: { job_id: string } } = await got.post(url, {
    json: body,
    responseType: 'json',
    headers: {
      accept: 'application/json',
      'X-LLM-API-Key': openRouterApiKey,
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

export function buildSotwCsvFromMooseResult(result: unknown, stepStartedAt?: string): string {
  // The SoTW CSV has one row per DPV entity instance in the Moose report.
  const headers = [
    'http://www.w3.org/ns/odrl/2/dateTime',
    'http://www.w3.org/ns/odrl/2/Party',
    'http://www.w3.org/ns/odrl/2/Action',
    'http://www.w3.org/ns/odrl/2/Asset',
    'http://www.w3.org/ns/odrl/2/Purpose',
  ];

  const entities: MooseEntity[] = [];

  if (result && typeof result === 'object') {
    const job = result as {
      status?: string;
      created_at?: string;
      result?: { results?: { entities?: MooseEntity[] | null }[] | null };
    };
    if (job.status === 'completed' && job.result?.results) {
      for (const r of job.result.results) {
        if (Array.isArray(r.entities)) {
          for (const entity of r.entities) {
            entities.push(entity);
          }
        }
      }
    }
  }

  const makeRow = (entity?: MooseEntity): string[] => [
    stepStartedAt ?? '', // Use the step start time when provided; otherwise leave empty
    '', // Party left blank until userId is available in SIMPIPE
    'http://www.w3.org/ns/odrl/2/use',
    entity ? JSON.stringify(entity.type_id) : '', // same entity type extracted from Moose is passed on, can be extended to IRI later
    'https://w3id.org/dpv#DataQualityImprovement', // picked a purpose which matched why data was in SIMPIPE
  ];

  const rows: string[][] = [];
  if (entities.length === 0) {
    rows.push(makeRow());
  } else {
    for (const entity of entities) {
      rows.push(makeRow(entity));
    }
  }

  const escapeCell = (value: string): string => {
    if (value.includes('"') || value.includes(',') || value.includes('\n')) {
      return `"${value.replaceAll('"', '""')}"`;
    }
    return value;
  };

  const headerLine = headers.map((value) => escapeCell(value)).join(',');
  const rowLines = rows.map((row) => row.map((value) => escapeCell(value)).join(','));
  const lines = [headerLine, ...rowLines];
  return `${lines.join('\n')}\n`;
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
  console.log('Fetched artifact text for DPV processing:', artifactText);
  // TODO: remove when moose api error is resolved
  // const result = {
  //   job_id: '7fec2e67-c6c8-4033-9490-1381a928be39',
  //   status: 'completed',
  //   created_at: '2026-01-22T17:28:13.615831+00:00',
  //   updated_at: '2026-01-22T17:28:52.218513+00:00',
  //   result: {
  //     results: [{
  //       task_id: 'task-1',
  //       entities: [{
  //         start: 32, end: 36, text: '76kg', type_id: 'dpv-pd:Weight', confidence: 0.531_791_907_514_450_9,
  //       }, {
  //         start: 48, end: 53, text: '99bpm', type_id: 'dpv-pd:PhysicalHealth', confidence: 0.543_209_876_543_209_8,
  //       }, {
  //         start: 69, end: 75, text: '131/88', type_id: 'dpv-pd:PhysicalHealth', confidence: 0.514_124_293_785_310_8,
  //       }, {
  //         start: 87, end: 91, text: '5254', type_id: 'dpv:ActivityMonitoring', confidence: 0.560_283_687_943_262_3,
  //       }, {
  //         start: 125, end: 133, text: 'John Doe', type_id: 'dpv:Patient', confidence: 0.518_918_918_918_918_8,
  //       }],
  //     }],
  //   },
  // };
  // return result;
  // Start Moose DPV job with the artifact text
  const jobId = await makeDPVCall(artifactText);
  console.log('Started DPV job with ID:', jobId);
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

export async function getMooseAnalysis(arguments_: QueryGetMooseAnalysisArguments): Promise<Query['getMooseAnalysis']> {
  const { artifactUrl, save } = arguments_;
  const { stepStartedAt } = arguments_;
  const result = await getDPVJobResultPolling(artifactUrl);

  // By default we persist the report alongside the artifact; callers can
  // opt out by passing save = false for preview-only requests.
  if (save !== false) {
    // Parse the Minio bucket and object key from the public artifact URL
    // so we can store the Moose report alongside the artifact itself.
    const url = new URL(artifactUrl);
    const pathParts = url.pathname.replace(/^\/+/, '').split('/');
    const bucketName = pathParts.shift()!; // e.g. "artifacts"
    const objectName = pathParts.join('/');

    await setMooseReportForArtifact(objectName, JSON.stringify(result), bucketName);

    // Also derive and persist an SoTW CSV representation alongside the Moose report.
    try {
      const csv = buildSotwCsvFromMooseResult(result, stepStartedAt ?? undefined);
      await setSotwReportForArtifact(objectName, csv, bucketName);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('[SoTW] Error generating or saving SoTW CSV', {
        artifactUrl,
        bucketName,
        objectName,
        error,
      });
    }
  }
  return JSON.stringify(result);
}
