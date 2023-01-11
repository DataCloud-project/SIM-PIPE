import ExpiryMap from 'expiry-map';
import expressAsyncHandler from 'express-async-handler';
import got from 'got';
import jose from 'jose';
import crypto from 'node:crypto';
import pMemoize from 'p-memoize';
import type { NextFunction, Request, Response } from 'express';
import type { KeyObject } from 'node:crypto';

/**
 * middleware definitions
 */
const KEYCLOAK_REALM_ENDPOINT = process.env.KEYCLOAK_REALM_ENDPOINT
  ?? 'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

async function getKeycloakPublicKey(): Promise<KeyObject> {
  const response = await got(KEYCLOAK_REALM_ENDPOINT).json<{ public_key: string }>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  const pem = `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;

  return crypto.createPublicKey({ key: pem, format: 'pem', type: 'pkcs1' });
}

const authenticationExpiryTimeout: number = Number.parseInt(
  process.env.Authentication_Expiry_Timeout || '', 10);
const keycloakPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

async function jwtMiddleware(
  request: Request, response: Response, next: NextFunction,
): Promise<void> {
  // Load the Authorisation header
  // and that the header is a Bearer token
  const authHeader = request.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    response.sendStatus(401);
    return;
  }

  const keycloaKey = await getKeycloakPublicKeyWithCache();
  const josePublicKey = await jose;

  // Extract the token from the header
  const token = authHeader.slice(7);

  const { auth } = request as unknown as {
    auth: { sub: string, preferred_username: string, iat: number, exp: number }
  };
  if (!auth) {
    response.sendStatus(401);
    return;
  }
  next();
}

export default expressAsyncHandler(jwtMiddleware);
