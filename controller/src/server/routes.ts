import { Router } from 'express';
import asyncHandler from 'express-async-handler';

import { keycloakAuthJwtMiddleware } from './auth-jwt-middleware.js';
import { generateJWTForHasura, getVaultKeyPair } from './hasura-jwt.js';
import type { Auth } from './auth-jwt-middleware.js';

export default function createRouter(): Router {
  const router = Router();

  // Health check, mostly for Kubernetes live probes
  router.get('/health', (request, response) => {
    response.sendStatus(204);
  });

  // Endpoint to obtain a JWT token to use with Hasura
  router.post('/hasura/jwt', keycloakAuthJwtMiddleware, asyncHandler(async (request, response) => {
    const { auth } = request as unknown as { auth: Auth };
    const jwt = await generateJWTForHasura(auth);
    response.set('Content-Type', 'text/plain');
    response.send(jwt);
  }));

  // Return the current public key used to sign the JWT tokens
  router.get('/hasura/jwk', asyncHandler(async (request, response) => {
    const keypair = await getVaultKeyPair();
    const key = keypair.publicKey.export({
      format: 'jwk',
    });
    // Set the max-age header to 1 minute
    response.set('Cache-Control', 'max-age=60');
    response.json({
      keys: [key],
    });
  }));

  return router;
}
