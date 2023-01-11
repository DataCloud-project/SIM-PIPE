import { SignJWT } from 'jose';
import crypto from 'node:crypto';
import type { JsonWebKeyInput, KeyObject } from 'node:crypto';

export type KeyPair = { publicKey: KeyObject; privateKey: KeyObject };

export async function generateEd25519KeyPair(
): Promise<KeyPair> {
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

export function loadJWKToKeyPair(jwk: string): KeyPair {
  const privateKey = crypto.createPrivateKey({
    key: JSON.parse(jwk) as JsonWebKey,
    format: 'jwk',
  } as JsonWebKeyInput);
  const publicKey = crypto.createPublicKey(privateKey);
  return { publicKey, privateKey };
}

export async function initialiseKeyPair(
): Promise<KeyPair> {
  // In case we want a hardcoded key, we can use the environment variable
  // Please note that the keys will not be automatically rotated
  const keyFromEnvironment = process.env.CONTROLLER_HASURA_JWT_PRIVATE_KEY;
  if (keyFromEnvironment) {
    return loadJWKToKeyPair(keyFromEnvironment);
  }
  return await generateEd25519KeyPair();
}

let vault: KeyPair | undefined;
let vaultAge: Date | undefined;

export async function getVaultKeyPair(automaticRotation = false): Promise<KeyPair> {
  const now = new Date();
  if (vault // if the vault is less than 1 hour old, return it
    && (!automaticRotation || (vaultAge && now.getTime() - vaultAge.getTime() < 3_600_000))) {
    return vault;
  }
  const keypair = await initialiseKeyPair();
  vault = keypair;
  vaultAge = now;
  return keypair;
}

export async function generateJWTForHasura({
  sub, name, iat, exp,
}: { sub: string; name: string; iat: number; exp: number; })
  : Promise<string> {
  const { privateKey } = await getVaultKeyPair(true);
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

  const jwt = await new SignJWT(hasuraJWT)
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .setProtectedHeader({ alg: 'EdDSA' })
    .sign(privateKey);
  return jwt;
}
