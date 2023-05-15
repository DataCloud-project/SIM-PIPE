import expressAsyncHandler from 'express-async-handler';
import { SignJWT } from 'jose';
import crypto from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import type { JsonWebKeyInput, KeyObject } from 'node:crypto';

import { hasuraControllerJwtPrivateKey } from '../config.js';
import type { Auth } from './auth-jwt-middleware.js';

type KeyPair = { publicKey: KeyObject; privateKey: KeyObject };

async function generateEd25519KeyPair(
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

function loadJWKToKeyPair(jwk: string): KeyPair {
  const privateKey = crypto.createPrivateKey({
    key: JSON.parse(jwk) as JsonWebKey,
    format: 'jwk',
  } as JsonWebKeyInput);
  const publicKey = crypto.createPublicKey(privateKey);
  return { publicKey, privateKey };
}

async function initialiseKeyPair(
): Promise<KeyPair> {
  // If a key is provided in the environment
  if (hasuraControllerJwtPrivateKey) {
    return loadJWKToKeyPair(hasuraControllerJwtPrivateKey);
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

async function hasuraJwtMiddlewareAsync(
  request: Request, response: Response, next: NextFunction,
): Promise<void> {
  const { auth } = request as unknown as { auth: Auth };
  if (!auth) {
    throw new Error('No auth provided, make sure to popuplate the auth object in the request');
  }
  const { isHasura } = request as unknown as { isHasura: boolean | undefined };
  if (isHasura) {
    next();
    return;
  }

  const jwt = await generateJWTForHasura(auth);
  // Set request header for Hasura
  request.headers.authorization = `Bearer ${jwt}`;
  next();
}

export const hasuraJwtMiddleware = expressAsyncHandler(hasuraJwtMiddlewareAsync);
