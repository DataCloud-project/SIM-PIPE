// Moose entity type for DPV results
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

export interface MooseEntity {
  start: number;
  end: number;
  text: string;
  type_id: string;
  confidence: number;
}

interface DpvRequestBody {
  text: string;
  llm: {
    provider: string;
    model: string;
  };
  schema: string;
}

export async function makeDPVCall(text: string): Promise<string> {
  if (!mooseApiKey) {
    throw new Error('MOOSE_API_KEY is not configured');
  }
  if (!openRouterApiKey) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }
  const url = `${mooseApiEndpoint}/ner`;

  const body: DpvRequestBody = {
    text,
    llm: {
      provider: mooseLlmProvider,
      model: mooseLlmModel,
    },
    schema: mooseDpvSchema,
  };

  console.log('full request (keys are hidden):', JSON.stringify({
    json: body,
    responseType: 'json',
    headers: {
      accept: 'application/json',
      'X-LLM-API-Key': 'openRouterApiKey',
      'X-API-Key': 'mooseApiKey',
      'Content-Type': 'application/json',
    },
  }));

  try {
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
  } catch (error) {
    console.error('Error making DPV call to Moose API:', error);
    throw error;
  }
}


// Define MooseJobResult type for the new Moose API response
export interface MooseJobResultEntity {
  start: number;
  end: number;
  text: string;
  type_id: string;
  confidence: number;
}

export interface MooseJobResult {
  job_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  result: {
    entities: MooseJobResultEntity[];
    warnings?: unknown[];
  };
  [key: string]: unknown;
}

export async function getDPVJobResult(jobId: string): Promise<MooseJobResult> {
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

  return response.body as MooseJobResult;
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
): Promise<MooseJobResult> {
  // Parse the Minio bucket and object key from the public artifact URL,
  // then fetch the content via the internal Minio client (not localhost).
  const url = new URL(artifactUrl);
  const pathParts = url.pathname.replace(/^\/+/, '').split('/');
  const bucketName = pathParts.shift()!; // e.g. "artifacts"
  const objectName = pathParts.join('/');

  const artifactText = await getObjectText(objectName, bucketName);
  console.log('Fetched artifact text for DPV processing:', artifactText);

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

    // edit confidence values to low, medium and high for new Moose API format
    if (result && result.result && Array.isArray(result.result.entities)) {
      for (const entity of result.result.entities) {
        if (entity.confidence > 0.75) {
          entity.confidence = 'high' as unknown as number;
        } else if (entity.confidence < 0.5) {
          entity.confidence = 'low' as unknown as number;
        } else {
          entity.confidence = 'medium' as unknown as number;
        }
      }
    }

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
