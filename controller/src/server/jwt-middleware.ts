import ExpiryMap from 'expiry-map';
import expressAsyncHandler from 'express-async-handler';
import got from 'got';
import { jwtVerify } from 'jose';
import crypto from 'node:crypto';
import pMemoize from 'p-memoize';
import type { NextFunction, Request, Response } from 'express';
import type { KeyObject } from 'node:crypto';

import { getVaultKeyPair } from './hasura-jwt.js';

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
  // const publicKey = await jose.importSPKI(pem, 'RS256');

  return crypto.createPublicKey({ key: pem, format: 'pem', type: 'pkcs1' });
}

const authenticationExpiryTimeout: number = Number.parseInt(
  process.env.Authentication_Expiry_Timeout || '', 10);
const keycloakPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

export type Auth = {
  sub: string;
  name: string;
  iat: number;
  exp: number;
};

async function jwtVerifyKeycloakToken(jwt: string): Promise<Auth> {
  const publicKey = await getKeycloakPublicKeyWithCache();
  const { payload } = await jwtVerify(jwt, publicKey);
  if (!payload || typeof payload.sub !== 'string' || typeof payload.preferred_username !== 'string'
    || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
    throw new Error('Invalid token');
  }

  const {
    sub, preferred_username: name, iat, exp,
  } = payload;
  return {
    sub, name, iat, exp,
  };
}

async function jwtVerifyHasuraToken(jwt: string): Promise<Auth> {
  const { publicKey } = await getVaultKeyPair();
  const { payload } = await jwtVerify(jwt, publicKey);
  if (!payload || typeof payload.sub !== 'string' || typeof payload.name !== 'string'
    || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
    throw new Error('Invalid token');
  }
  const {
    sub, name, iat, exp,
  } = payload;
  return {
    sub, name, iat, exp,
  };
}

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
  const jwt = authHeader.slice(7);

  // Parse the header of the JWT Token, without a .split because we are not animals
  const base64Header = jwt.slice(0, jwt.indexOf('.'));
  const header: unknown = JSON.parse(Buffer.from(base64Header, 'base64').toString('utf8'));
  if (!header || typeof header !== 'object' || !('alg' in header) || typeof header.alg !== 'string') {
    response.sendStatus(401);
    return;
  }
  const { alg } = header;
  let auth: Auth;
  try {
    // If we get a EdDSA token, we assume it's not a keycloak token but a hasura token
    auth = await (alg === 'EdDSA' ? jwtVerifyHasuraToken(jwt) : jwtVerifyKeycloakToken(jwt));
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    response.sendStatus(401);
    return;
  }

  // Attach the payload to the request
  (request as unknown as { auth: Auth }).auth = auth;

  next();
}

export default expressAsyncHandler(jwtMiddleware);
