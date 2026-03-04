// Moose entity type for DPV results
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

interface MooseEntity {
  start: number;
  end: number;
  text: string;
  type_id: string;
  confidence: number;
}

function escapeCsvCell(value: string): string {
  if (value.includes('"') || value.includes(',') || value.includes('\n')) {
    return `"${value.replaceAll('"', '""')}"`;
  }
  return value;
}

function parseArtifactUrl(artifactUrl: string): { bucketName: string; objectName: string } {
  const url = new URL(artifactUrl);
  const pathParts = url.pathname.replace(/^\/+/, '').split('/');
  const bucketName = pathParts.shift();
  const objectName = pathParts.join('/');

  if (!bucketName || objectName.length === 0) {
    throw new Error(`Invalid artifact URL: ${artifactUrl}`);
  }

  return { bucketName, objectName };
}

interface DpvRequestBody {
  text: string;
  llm: {
    provider: string;
    model: string;
  };
  schema: string;
}

async function makeDPVCall(text: string): Promise<string> {
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

  // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.log('DPV response:', response.body);
    return response.body.job_id;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error making DPV call to Moose API:', error);
    throw error;
  }
}

// Define MooseJobResult type for the new Moose API response
interface MooseJobResultEntity {
  start: number;
  end: number;
  text: string;
  type_id: string;
  confidence: number;
}

interface MooseJobResult {
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

async function getDPVJobResult(jobId: string): Promise<MooseJobResult> {
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
// Helper to expand CURIEs to IRIs
function getIRI(dpvEntity: string): string {
  if (dpvEntity.startsWith('dpv-pd:')) {
    return `https://w3id.org/dpv/pd/owl#${dpvEntity.slice('dpv-pd:'.length)}`;
  }
  if (dpvEntity.startsWith('dpv:')) {
    return `https://w3id.org/dpv/owl#${dpvEntity.slice('dpv:'.length)}`;
  }
  return dpvEntity;
}

function buildSotwCsvFromMooseResult(
  result: MooseJobResult,
  stepStartedAt?: string,
): string {
  // The SoTW CSV has one row per DPV entity instance in the Moose report.
  const headers = [
    'http://www.w3.org/ns/odrl/2/dateTime',
    'http://www.w3.org/ns/odrl/2/Party',
    'http://www.w3.org/ns/odrl/2/Action',
    'http://www.w3.org/ns/odrl/2/Asset',
    'https://www.sintef.no/ontology#contains',
    'http://www.w3.org/ns/odrl/2/purpose',
  ];

  const entities: MooseEntity[] = result
    && typeof result === 'object'
    && result.status === 'completed'
    && result.result
    && Array.isArray(result.result.entities)
    ? result.result.entities
    : [];

  const makeRow = (entity?: MooseEntity): string[] => [
    stepStartedAt ?? '', // Use the step start time when provided; otherwise leave empty
    'https://w3id.org/dpv/owl#Entity',
    'http://www.w3.org/ns/odrl/2/use',
    'https://w3id.org/dpv/owl#Data', // Asset column is always this IRI
    entity && entity.type_id
      ? getIRI(entity.type_id)
      : '', // Asset (contains) column: expanded IRI
    'https://w3id.org/dpv/owl#DataQualityImprovement', // Purpose column
  ];

  const rows: string[][] = [];
  if (entities.length === 0) {
    rows.push(makeRow());
  } else {
    for (const entity of entities) {
      rows.push(makeRow(entity));
    }
  }

  const headerLine = headers.map((value) => escapeCsvCell(value)).join(',');
  const rowLines = rows.map((row) => row.map((value) => escapeCsvCell(value)).join(','),
  );
  const lines = [headerLine, ...rowLines];
  return `${lines.join('\n')}\n`;
}

async function getDPVJobResultPolling(
  artifactUrl: string,
  pollingIntervalMs = 4000,
  maxAttempts = 80,
): Promise<MooseJobResult> {
  // Parse the Minio bucket and object key from the public artifact URL,
  // then fetch the content via the internal Minio client (not localhost).
  const { bucketName, objectName } = parseArtifactUrl(artifactUrl);

  const artifactText = await getObjectText(objectName, bucketName);
  // eslint-disable-next-line no-console
  console.log('Fetched artifact text for DPV processing:', artifactText);

  // Start Moose DPV job with the artifact text
  const jobId = await makeDPVCall(artifactText);
  // eslint-disable-next-line no-console
  console.log('Started DPV job with ID:', jobId);

  const poll = async (attempt: number): Promise<MooseJobResult> => {
    const result = await getDPVJobResult(jobId);
    if (result.status === 'completed' || result.status === 'failed') {
      // eslint-disable-next-line no-console
      console.log('DPV job polling result:', result);
      return result;
    }

    // eslint-disable-next-line no-console
    console.log('Polling attempt', attempt);

    if (attempt + 1 >= maxAttempts) {
      const message = `DPV job ${jobId} did not reach status 'completed' or 'failed' after `
        + `${maxAttempts} attempts`;
      throw new Error(message);
    }

    await new Promise((resolve) => {
      setTimeout(resolve, pollingIntervalMs);
    });

    return poll(attempt + 1);
  };

  return poll(0);
}

// eslint-disable-next-line import/prefer-default-export
export async function getMooseAnalysis(
  arguments_: QueryGetMooseAnalysisArguments,
): Promise<Query['getMooseAnalysis']> {
  const { artifactUrl, save } = arguments_;
  const { stepStartedAt } = arguments_;
  const result = await getDPVJobResultPolling(artifactUrl);

  // By default we persist the report alongside the artifact; callers can
  // opt out by passing save = false for preview-only requests.
  if (save !== false) {
    // Parse the Minio bucket and object key from the public artifact URL
    // so we can store the Moose report alongside the artifact itself.
    const { bucketName, objectName } = parseArtifactUrl(artifactUrl);

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
