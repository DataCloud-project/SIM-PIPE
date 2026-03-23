import { Router } from 'express';

// Basic router for unauthenticated endpoints (e.g. health checks)
export default function createRouter(): Router {
  const router = Router();

  // Health check, mostly for Kubernetes live probes
  router.get('/health', (_request, response) => {
    response.sendStatus(204);
  });

  return router;
}
