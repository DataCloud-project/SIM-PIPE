import { json, Router } from 'express';
import asyncHandler from 'express-async-handler';

import { jwtDevMode as jwtDevelopmentMode } from '../config.js';
import { hybridAuthJwtMiddleware, keycloakAuthJwtMiddleware } from './auth-jwt-middleware.js';
import { hasuraJwtMiddleware } from './hasura-jwt.js';
import hasuraProxyMiddleware from './routes/hasura/graphql.js';
import hasuraJwk from './routes/hasura/jwk.js';
import hasuraJwt from './routes/hasura/jwt.js';
import hasuraJwtDevelopment from './routes/hasura/jwt-development.js';
import { minioWebhookHead, minioWebhookPost } from './routes/minio/webhook.js';

export default function createRouter(): Router {
  const router = Router();

  // Health check, mostly for Kubernetes live probes
  router.get('/health', (request, response) => {
    response.sendStatus(204);
  });

  // Endpoint to obtain a JWT token to use with Hasura
  router.post('/hasura/jwt',
    keycloakAuthJwtMiddleware,
    asyncHandler(hasuraJwt),
  );

  // Return the current public key used to sign the JWT tokens
  router.get('/hasura/jwk', asyncHandler(hasuraJwk));

  // Proxy endpoint to Hasura
  router.post('/hasura/graphql',
    hybridAuthJwtMiddleware,
    hasuraJwtMiddleware,
    hasuraProxyMiddleware(),
  );

  // Minio webhook endpoint
  router.head('/minio/webhook', asyncHandler(minioWebhookHead));
  router.post('/minio/webhook', json(), asyncHandler(minioWebhookPost));

  // Generate a local development JWT token that is not authenticated
  // This feature MUST NOT be enabled in production
  if (jwtDevelopmentMode) {
    router.post('/hasura/jwt-dev',
      json(),
      asyncHandler(hasuraJwtDevelopment));
  }

  return router;
}
