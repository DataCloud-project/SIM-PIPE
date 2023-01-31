import { json, Router } from 'express';
import asyncHandler from 'express-async-handler';

import { jwtDevMode as jwtDevelopmentMode, user } from '../config.js';
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

  // Generate a local development JWT token that is not authenticated
  // This feature MUST NOT be enabled in production
  if (jwtDevelopmentMode) {
    router.post('/hasura/jwt-dev', json(), asyncHandler(async (request, response) => {
      const body = request.body as {
        sub?: unknown
        name?: unknown
        exp?: unknown
      };
      if (body.sub !== undefined && typeof body.sub !== 'string') {
        response.status(400).send('Invalid sub');
        return;
      }
      if (body.name !== undefined && typeof body.name !== 'string') {
        response.status(400).send('Invalid name');
        return;
      }
      if (body.exp !== undefined && typeof body.exp !== 'number') {
        response.status(400).send('Invalid exp');
        return;
      }
      // load system username
      const sub = body.sub ?? user;
      const name = body.name ?? sub;
      const iat = Math.floor(Date.now() / 1000);
      // In 8 hours (what should be a working day)
      const exp = body.exp ?? iat + 60 * 60 * 8;
      const jwt = await generateJWTForHasura({
        sub,
        name,
        iat,
        exp,
      });
      response.set('Content-Type', 'text/plain');
      response.send(jwt);
    }));
  }

  return router;
}
