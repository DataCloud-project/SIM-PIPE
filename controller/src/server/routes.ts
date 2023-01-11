import { Router } from 'express';
import asyncHandler from 'express-async-handler';
import type { RequestHandler } from 'express';

import { generateJWTForHasura, getVaultKeyPair } from './hasura-jwt.js';
import jwtMiddleware from './jwt-middleware.js';

export default function createRouter(): Router {
  const router = Router();

  // Health check, mostly for Kubernetes live probes
  router.get('/health', (request, response) => {
    response.sendStatus(204);
  });

  // Endpoint to obtain a JWT token to use with Hasura
  // The cast is because the jwt-express middleware returns a promise that is ignored by express < 5
  router.post('/hasura/jwt', jwtMiddleware as RequestHandler, asyncHandler(async (request, response) => {
    const { auth } = request as unknown as {
      auth: { sub: string, preferred_username: string, iat: number, exp: number }
    };
    const {
      sub, preferred_username: name, iat, exp,
    } = auth;

    const jwt = await generateJWTForHasura({
      sub, name, iat, exp,
    });
    response.set('Content-Type', 'text/plain');
    response.send(jwt);
  }));

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
