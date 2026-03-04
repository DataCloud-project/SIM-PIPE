import { type Request, type Response, Router } from 'express';

import { kubernetesNamespace } from '../config.js';
import { getApiTokenSecrets, updateApiTokenSecrets } from '../k8s/api-tokens.js';
import type K8sClient from '../k8s/k8s-client.js';

type ApiTokensBody = {
  mooseApiKey?: string;
  openrouterApiKey?: string;
};

function parseApiTokensBody(body: unknown): ApiTokensBody {
  if (typeof body !== 'object' || body === null) return {};
  const raw = body as Record<string, unknown>;

  return {
    mooseApiKey: typeof raw.mooseApiKey === 'string' ? raw.mooseApiKey : undefined,
    openrouterApiKey: typeof raw.openrouterApiKey === 'string' ? raw.openrouterApiKey : undefined,
  };
}

function handleTokensError(response: Response, error: unknown, message: string): void {
  // eslint-disable-next-line no-console
  console.error(message, error);
  response.status(500).json({ message });
}

export default function createApiRouter(k8sClient: K8sClient): Router {
  const router = Router();
  const namespace = kubernetesNamespace;

  // Manage controller-related API tokens stored in K8s Secrets
  router.get('/api/tokens', (_request: Request, response: Response) => {
    // eslint-disable-next-line no-void, @typescript-eslint/explicit-function-return-type
    void (async () => {
      try {
        const tokens = await getApiTokenSecrets(k8sClient, namespace);
        response.json(tokens);
      } catch (error) {
        handleTokensError(response, error, 'Failed to get API tokens');
      }
    })();
  });

  router.put('/api/tokens', (request: Request, response: Response) => {
    // eslint-disable-next-line no-void, @typescript-eslint/explicit-function-return-type
    void (async () => {
      try {
        const { mooseApiKey, openrouterApiKey } = parseApiTokensBody(request.body);
        const updated = await updateApiTokenSecrets(k8sClient, namespace, {
          mooseApiKey,
          openrouterApiKey,
        });
        response.json(updated);
      } catch (error) {
        handleTokensError(response, error, 'Failed to update API tokens');
      }
    })();
  });

  return router;
}
