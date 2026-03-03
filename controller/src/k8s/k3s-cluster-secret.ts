import type { V1Secret } from '@kubernetes/client-node';
import { K3S_TOKEN_SECRET } from '../config.js';
import type K8sClient from './k8s-client.js';

export interface K3sClusterSecret {
  token: string;
  serverIp: string;
}

const TOKEN_KEY = 'token';
const SERVER_IP_KEY = 'K3S_SERVER_IP';

async function readSecretValue(
  k8sClient: K8sClient,
  namespace: string,
  name: string,
  key: string,
): Promise<string> {
  try {
    const res = await k8sClient.core.readNamespacedSecret(name, namespace);
    const data = res.body.data ?? {};
    const encoded = data[key];
    if (!encoded) return '';
    return Buffer.from(encoded, 'base64').toString('utf8');
  } catch (error: any) {
    if (error?.response?.statusCode === 404) {
      return '';
    }
    throw error;
  }
}

async function upsertK3sSecret(
  k8sClient: K8sClient,
  namespace: string,
  name: string,
  token: string,
  serverIp: string,
): Promise<void> {
  const encodedToken = Buffer.from(token ?? '', 'utf8').toString('base64');
  const encodedServerIp = Buffer.from(serverIp ?? '', 'utf8').toString('base64');

  let existing: V1Secret | undefined;
  try {
    const res = await k8sClient.core.readNamespacedSecret(name, namespace);
    existing = res.body;
  } catch (error: any) {
    if (error?.response?.statusCode !== 404) {
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
        [TOKEN_KEY]: encodedToken,
        [SERVER_IP_KEY]: encodedServerIp,
      },
    };
    await k8sClient.core.createNamespacedSecret(namespace, secret);
    return;
  }

  const data = existing.data ?? {};
  data[TOKEN_KEY] = encodedToken;
  data[SERVER_IP_KEY] = encodedServerIp;
  existing.data = data;
  await k8sClient.core.replaceNamespacedSecret(name, namespace, existing);
}

export async function getK3sClusterSecret(
  k8sClient: K8sClient,
  namespace: string,
): Promise<K3sClusterSecret> {
  const [token, serverIp] = await Promise.all([
    readSecretValue(k8sClient, namespace, K3S_TOKEN_SECRET, TOKEN_KEY),
    readSecretValue(k8sClient, namespace, K3S_TOKEN_SECRET, SERVER_IP_KEY),
  ]);

  return { token, serverIp };
}

export async function updateK3sClusterSecret(
  k8sClient: K8sClient,
  namespace: string,
  partial: Partial<K3sClusterSecret>,
): Promise<K3sClusterSecret> {
  const current = await getK3sClusterSecret(k8sClient, namespace);
  const next: K3sClusterSecret = {
    token: partial.token !== undefined ? partial.token : current.token,
    serverIp: partial.serverIp !== undefined ? partial.serverIp : current.serverIp,
  };

  await upsertK3sSecret(k8sClient, namespace, K3S_TOKEN_SECRET, next.token, next.serverIp);
  return next;
}
