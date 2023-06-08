import z from 'zod';
import type { CoreV1Api, V1Secret } from '@kubernetes/client-node';

import type {
  DockerRegistryCredentialInput, Mutation, Query,
} from './schema';

const AuthSchema = z.object({
  username: z.string(),
  password: z.string(),
  auth: z.string(),
});

const DocumentSchema = z.object({
  auths: z.record(AuthSchema),
});

export async function dockerRegistryCredentials(
  k8sClient: CoreV1Api, k8sNamespace: string,
): Promise<Query['dockerRegistryCredentials']> {
  const credentials = await k8sClient.listNamespacedSecret(
    k8sNamespace, undefined, undefined, undefined, 'type=kubernetes.io/dockerconfigjson',
  );
  const credentialsData = credentials.body.items.flatMap((item) => {
    const name = item.metadata?.name ?? '';
    const dockerconfigjson = item.data?.['.dockerconfigjson'] ?? '';
    const base64decoded = Buffer.from(dockerconfigjson, 'base64').toString('utf8');
    let jsonParsed;
    try {
      jsonParsed = DocumentSchema.parse(JSON.parse(base64decoded));
    } catch (error) {
      const message = `parsing error: ${(error as Error).message}`;
      return [{
        name,
        server: message,
        username: '',
      }];
    }

    const { auths } = jsonParsed;

    return Object.entries(auths).map(([server, { username }]) => ({
      name,
      server,
      username,
    }));
  });

  return credentialsData;
}

function createDockerConfigJsonBase64(server: string, username: string, password: string): string {
  const auth = Buffer.from(`${username}:${password}`).toString('base64');
  const auths = {
    [server]: {
      username,
      password,
      auth,
    },
  };
  const dockerconfigjson = JSON.stringify({ auths });
  const base64encoded = Buffer.from(dockerconfigjson).toString('base64');
  return base64encoded;
}

export async function createDockerRegistryCredential(
  credentialInput: DockerRegistryCredentialInput,
  k8sClient: CoreV1Api, k8sNamespace: string,
): Promise<Mutation['createDockerRegistryCredential']> {
  const {
    name, username, password, server,
  } = credentialInput;

  const secret: V1Secret = {
    apiVersion: 'v1',
    kind: 'Secret',
    metadata: {
      name,
    },
    type: 'kubernetes.io/dockerconfigjson',
    data: {
      '.dockerconfigjson': createDockerConfigJsonBase64(server, username, password),
    },
  };

  const response = await k8sClient.createNamespacedSecret(k8sNamespace, secret);
  const createdSecret = response.body;

  return {
    name: createdSecret.metadata?.name ?? '',
    server,
    username,
  };
}

export async function updateDockerRegistryCredential(
  credentialInput: DockerRegistryCredentialInput,
  k8sClient: CoreV1Api, k8sNamespace: string,
): Promise<Mutation['updateDockerRegistryCredential']> {
  const {
    name, username, password, server,
  } = credentialInput;

  await k8sClient.patchNamespacedSecret(name, k8sNamespace, [{
    op: 'replace',
    path: '/data/.dockerconfigjson',
    value: createDockerConfigJsonBase64(server, username, password),
  }], undefined, undefined, undefined, undefined, undefined, {
    headers: {
      'Content-Type': 'application/json-patch+json',
    },
  });

  return {
    name,
    server,
    username,
  };
}

export async function deleteDockerRegistryCredential(
  name: string, k8sClient: CoreV1Api, k8sNamespace: string,
): Promise<Mutation['deleteDockerRegistryCredential']> {
  try {
    await k8sClient.deleteNamespacedSecret(name, k8sNamespace);
    return true;
  } catch (error) {
    // If 404, return false, otherwise throws
    if ((error as Error & { response?: { statusCode: number } })
      .response?.statusCode === 404) {
      return false;
    }
    throw error;
  }
}
