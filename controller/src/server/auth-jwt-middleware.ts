import ExpiryMap from 'expiry-map';
import expressAsyncHandler from 'express-async-handler';
import got from 'got';
import { jwtVerify } from 'jose';
import crypto from 'node:crypto';
import pMemoize from 'p-memoize';
import type { NextFunction, Request, Response } from 'express';
import type { KeyObject } from 'node:crypto';

import { authenticationExpiryTimeout, jwtUser, oauth2IssuerEndpoint } from '../config.js';

/**
 * middleware definitions
 */

async function getOauth2IssuerPublicKey(): Promise<KeyObject> {
  if (!oauth2IssuerEndpoint) {
    throw new Error('OAUTH2_ISSUER_ENDPOINT is not set');
  }
  const response = await got(oauth2IssuerEndpoint).json<{ public_key: string }>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  const pem = `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;
  return crypto.createPublicKey({ key: pem, format: 'pem', type: 'spki' });
}

const oauth2IssuerPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getOauth2IssuerPublicKeyWithCache = pMemoize(
  getOauth2IssuerPublicKey, { cache: oauth2IssuerPublicKeyCache },
);

export type Auth = {
  sub: string;
  name: string;
  iat?: number;
  exp?: number;
};

async function jwtVerifyOauth2IssuerToken(jwt: string): Promise<Auth> {
  const publicKey = await getOauth2IssuerPublicKeyWithCache();
  let payload;
  try {
    // clockTolerance: 60s covers minor clock drift between the K8s pod and the
    // host-resident Keycloak process, and races between token refresh and request arrival.
    const result = await jwtVerify(jwt, publicKey, { clockTolerance: 60 });
    payload = result.payload;
  } catch (verifyError) {
    // eslint-disable-next-line no-console
    console.error('[auth] jwtVerify failed:', verifyError instanceof Error ? verifyError.message : verifyError);
    throw verifyError;
  }
  if (!payload || typeof payload.sub !== 'string' || typeof payload.preferred_username !== 'string'
    || typeof payload.iat !== 'number' || typeof payload.exp !== 'number') {
    // eslint-disable-next-line no-console
    console.error('[auth] Invalid token payload:', JSON.stringify({
      sub: typeof payload?.sub,
      preferred_username: typeof payload?.preferred_username,
      iat: typeof payload?.iat,
      exp: typeof payload?.exp,
    }));
    throw new Error('Invalid token');
  }

  const {
    sub, preferred_username: name, iat, exp,
  } = payload;
  return {
    sub, name, iat, exp,
  };
}

const fixedLocalAuth: Auth = {
  sub: jwtUser,
  name: jwtUser,
};

async function hybridAuthJwtMiddlewareAsync(
  request: Request, response: Response, next: NextFunction,
): Promise<void> {
  // If we are in development mode, we allow a fixed local user
  if (oauth2IssuerEndpoint === undefined) {
    // eslint-disable-next-line no-console
    console.log('[auth] Dev mode (OAUTH2_ISSUER_ENDPOINT not set), using fixed local user');
    (request as unknown as { auth: Auth }).auth = fixedLocalAuth;
    next();
    return;
  }

  // eslint-disable-next-line no-console
  console.log('[auth] OAUTH2_ISSUER_ENDPOINT:', oauth2IssuerEndpoint);

  // Load the Authorisation header
  // and that the header is a Bearer token
  const authHeader = request.headers.authorization;

  // We allow anonymous access to the API
  if (!authHeader) {
    // eslint-disable-next-line no-console
    console.log('[auth] No authorization header, proceeding as anonymous');
    next();
    return;
  }

  // eslint-disable-next-line no-console
  console.log('[auth] Authorization header present, length:', authHeader.length);

  // If it's not a bearer token
  if (!authHeader.startsWith('Bearer ')) {
    response.status(401).json({ errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }] });
    return;
  }

  // Load the JWT token
  const jwt = authHeader.slice(7);
  let auth: Auth;
  try {
    auth = await jwtVerifyOauth2IssuerToken(jwt);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(error);
    response.status(401).json({ errors: [{ message: 'Unauthorized', extensions: { code: 'UNAUTHENTICATED' } }] });
    return;
  }

  // Attach the payload to the request
  (request as unknown as { auth: Auth }).auth = auth;

  next();
}

export default expressAsyncHandler(hybridAuthJwtMiddlewareAsync);
