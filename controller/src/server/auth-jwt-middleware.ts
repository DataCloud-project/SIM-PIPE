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
  return crypto.createPublicKey({ key: pem, format: 'pem', type: 'pkcs1' });
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

const fixedLocalAuth: Auth = {
  sub: jwtUser,
  name: jwtUser,
};

async function hybridAuthJwtMiddlewareAsync(
  request: Request, response: Response, next: NextFunction,
): Promise<void> {
  // Load the Authorisation header
  // and that the header is a Bearer token
  const authHeader = request.headers.authorization;

  // If we are in development mode, we allow a fixed local user
  if (oauth2IssuerEndpoint === undefined) {
    // Throw an error if the user is trying to use a bearer token
    // It might be a dangerous mistake
    if (authHeader) {
      response.sendStatus(400);
      return;
    }

    (request as unknown as { auth: Auth }).auth = fixedLocalAuth;
    next();
    return;
  }

  // We allow anonymous access to the API
  if (!authHeader) {
    next();
    return;
  }

  // If it's not a bearer token
  if (!authHeader.startsWith('Bearer ')) {
    response.sendStatus(401);
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
    response.sendStatus(401);
    return;
  }

  // Attach the payload to the request
  (request as unknown as { auth: Auth }).auth = auth;

  next();
}

export default expressAsyncHandler(hybridAuthJwtMiddlewareAsync);
