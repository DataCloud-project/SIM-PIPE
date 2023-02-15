import type { Request, Response } from 'express';

import { jwtUser } from '../../../config.js';
import { generateJWTForHasura } from '../../hasura-jwt.js';

export default async function hasuraJwtDevelopment(
  request: Request, response: Response,
): Promise<void> {
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
  const sub = body.sub ?? jwtUser;
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
}
