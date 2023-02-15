import type { Request, Response } from 'express';

import { generateJWTForHasura } from '../../hasura-jwt.js';
import type { Auth } from '../../auth-jwt-middleware.js';

export default async function hasuraJwt(
  request: Request, response: Response,
): Promise<void> {
  const { auth } = request as unknown as { auth: Auth };
  const jwt = await generateJWTForHasura(auth);
  response.set('Content-Type', 'text/plain');
  response.send(jwt);
}
