import { Router } from 'express';
import type K8sClient from '../k8s/k8s-client.js';
import { kubernetesNamespace } from '../config.js';
import { getApiTokenSecrets, updateApiTokenSecrets } from '../k8s/api-tokens.js';

export default function createApiRouter(k8sClient: K8sClient): Router {
  const router = Router();
  const namespace = kubernetesNamespace;

  // Manage controller-related API tokens stored in K8s Secrets
  router.get('/api/tokens', async (_req, res) => {
    try {
      const tokens = await getApiTokenSecrets(k8sClient, namespace);
      res.json(tokens);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to get API tokens', error);
      res.status(500).json({ message: 'Failed to get API tokens' });
    }
  });

  router.put('/api/tokens', async (req, res) => {
    try {
      const { mooseApiKey, openrouterApiKey, openrouterApiKeyPaid } = req.body ?? {};
      const updated = await updateApiTokenSecrets(k8sClient, namespace, {
        mooseApiKey,
        openrouterApiKey,
        openrouterApiKeyPaid,
      });
      res.json(updated);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to update API tokens', error);
      res.status(500).json({ message: 'Failed to update API tokens' });
    }
  });

  return router;
}
