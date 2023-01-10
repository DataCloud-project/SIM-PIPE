import jwt from 'jsonwebtoken';
import crypto from 'node:crypto';
import type { JsonWebKeyInput, KeyObject } from 'node:crypto';

export async function generateEd25519KeyPair(
): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
  return await new Promise((resolve, reject) => {
    crypto.generateKeyPair('ed25519', undefined, (error, publicKey, privateKey) => {
      if (error) {
        reject(error);
      } else {
        resolve({ publicKey, privateKey });
      }
    });
  });
}

export function exportKeyObjectToJWK(publicKey: KeyObject): string {
  return JSON.stringify(publicKey.export({
    format: 'jwk',
  }));
}

export function loadJWKToKeyPair(jwk: string): { publicKey: KeyObject; privateKey: KeyObject } {
  const privateKey = crypto.createPrivateKey({
    key: JSON.parse(jwk) as JsonWebKey,
    format: 'jwk',
  } as JsonWebKeyInput);
  const publicKey = crypto.createPublicKey(privateKey);
  return { publicKey, privateKey };
}

export async function initialiseKeyPair(
): Promise<{ publicKey: KeyObject; privateKey: KeyObject }> {
  const keyFromEnvironment = process.env.CONTROLLER_HASURA_JWT_PRIVATE_KEY;
  if (keyFromEnvironment) {
    return loadJWKToKeyPair(keyFromEnvironment);
  }
  /* eslint-disable no-console */
  console.warn('No private key found in environment variable CONTROLLER_HASURA_JWT_PRIVATE_KEY');
  const keypair = await generateEd25519KeyPair();
  console.warn('Generating a new key pair:');
  console.warn(exportKeyObjectToJWK(keypair.privateKey));
  /* eslint-enable no-console */
  return keypair;
}

export async function generateJWTForHasura({
  sub, name, iat, exp,
}: { sub: string; name: string; iat: number; exp: number; })
  : Promise<string> {
  const { privateKey } = await initialiseKeyPair();
  const hasuraJWT = {
    sub,
    name,
    iat,
    exp,
    admin: false,
    'https://hasura.io/jwt/claims': {
      'x-hasura-allowed-roles': ['user'],
      'x-hasura-default-role': 'user',
      'x-hasura-user-id': sub,
    },
  };

  return jwt.sign(hasuraJWT, privateKey, {
    algorithm: 'ES256',
  });
}
