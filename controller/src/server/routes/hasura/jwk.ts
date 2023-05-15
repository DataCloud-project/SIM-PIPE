import type { Request, Response } from 'express';

import { getVaultKeyPair } from '../../hasura-jwt.js';

export default async function hasuraJwk(
  request: Request, response: Response,
): Promise<void> {
  const keypair = await getVaultKeyPair();
  const key = keypair.publicKey.export({
    format: 'jwk',
  });
  // Set the max-age header to 1 minute
  response.set('Cache-Control', 'max-age=60');
  response.json({
    keys: [key],
  });
}
