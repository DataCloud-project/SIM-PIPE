import { Router } from 'express';
import type { RequestHandler } from 'express';

import { generateJWTForHasura } from './hasura-jwt.js';
import jwtMiddleware from './jwt-middleware.js';

export default function createRouter(): Router {
  const router = Router();

  // Health check, mostly for Kubernetes live probes
  router.get('/health', (request, response) => {
    response.sendStatus(204);
  });

  // Endpoint to obtain a JWT token to use with Hasura
  // The cast is because the jwt-express middleware returns a promise that is ignored by express < 5
  router.post('/hasura/jwt', jwtMiddleware as RequestHandler, (request, response) => {
    const { auth } = request as unknown as {
      auth: { sub: string, preferred_username: string, iat: number, exp: number }
    };
    const {
      sub, preferred_username: name, iat, exp,
    } = auth;

    generateJWTForHasura({
      sub, name, iat, exp,
    }).then((jwt) => {
      response.json(jwt);
    }).catch((error) => {
      response.status(500).json({ error });
    });
  });

  router.get('/hasura/jwk', (request, response) => {
    response.json({
      keys: [
        {
          kty: 'RSA',
          alg: 'RS256',
          use: 'sig',
          kid: 'keycloak',
          n: 'x',
          e: 'x',
        },
      ],
    });
  });

  return router;
}
