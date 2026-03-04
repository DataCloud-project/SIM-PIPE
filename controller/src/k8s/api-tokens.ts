import type { V1Secret } from '@kubernetes/client-node';

import type K8sClient from './k8s-client.js';

interface ApiTokenSecrets {
  mooseApiKey: string;
  openrouterApiKey: string;
}

const MOOSE_SECRET_NAME = 'simpipe-moose-api';
const MOOSE_SECRET_KEY = 'MOOSE_API_KEY';

const OPENROUTER_SECRET_NAME = 'simpipe-openrouter-api';
const OPENROUTER_SECRET_KEY = 'OPENROUTER_API_KEY';

function getStatusCode(error: unknown): number | undefined {
  if (typeof error !== 'object' || error === null) return undefined;
  if (!('response' in error)) return undefined;
  const { response } = (error as { response?: { statusCode?: number } });
  return response?.statusCode;
}

async function readSecretValue(
  k8sClient: K8sClient,
  namespace: string,
  name: string,
  key: string,
): Promise<string> {
  try {
    const response = await k8sClient.core.readNamespacedSecret(name, namespace);
    const data = response.body.data ?? {};
    const encoded = data[key];
    if (!encoded) return '';
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch (error: unknown) {
    // If the secret does not exist, treat as empty string
    if (getStatusCode(error) === 404) {
      return '';
    }
    throw error;
  }
}

async function upsertSecretValue(
  k8sClient: K8sClient,
  namespace: string,
  name: string,
  key: string,
  value: string,
): Promise<void> {
  const encodedValue = Buffer.from(value ?? '', 'utf8').toString('base64');

  let existing: V1Secret | undefined;
  try {
    const response = await k8sClient.core.readNamespacedSecret(name, namespace);
    existing = response.body;
  } catch (error: unknown) {
    if (getStatusCode(error) !== 404) {
      throw error;
    }
  }

  if (!existing) {
    const secret: V1Secret = {
      apiVersion: 'v1',
      kind: 'Secret',
      metadata: {
        name,
        namespace,
      },
      type: 'Opaque',
      data: {
        [key]: encodedValue,
      },
    };
    await k8sClient.core.createNamespacedSecret(namespace, secret);
    return;
  }

  const data = existing.data ?? {};
  data[key] = encodedValue;
  existing.data = data;
  await k8sClient.core.replaceNamespacedSecret(name, namespace, existing);
}

export async function getApiTokenSecrets(
  k8sClient: K8sClient,
  namespace: string,
): Promise<ApiTokenSecrets> {
  const [mooseApiKey, openrouterApiKey] = await Promise.all([
    readSecretValue(k8sClient, namespace, MOOSE_SECRET_NAME, MOOSE_SECRET_KEY),
    readSecretValue(k8sClient, namespace, OPENROUTER_SECRET_NAME, OPENROUTER_SECRET_KEY),
  ]);

  return {
    mooseApiKey,
    openrouterApiKey,
  };
}

export async function updateApiTokenSecrets(
  k8sClient: K8sClient,
  namespace: string,
  tokens: Partial<ApiTokenSecrets>,
): Promise<ApiTokenSecrets> {
  const current = await getApiTokenSecrets(k8sClient, namespace);
  const next: ApiTokenSecrets = {
    mooseApiKey:
      tokens.mooseApiKey !== undefined && tokens.mooseApiKey.trim() !== ''
        ? tokens.mooseApiKey
        : current.mooseApiKey,
    openrouterApiKey:
      tokens.openrouterApiKey !== undefined && tokens.openrouterApiKey.trim() !== ''
        ? tokens.openrouterApiKey
        : current.openrouterApiKey,
  };

  await Promise.all([
    upsertSecretValue(k8sClient, namespace, MOOSE_SECRET_NAME, MOOSE_SECRET_KEY, next.mooseApiKey),
    upsertSecretValue(
      k8sClient,
      namespace,
      OPENROUTER_SECRET_NAME,
      OPENROUTER_SECRET_KEY,
      next.openrouterApiKey,
    ),
  ]);

  return next;
}
