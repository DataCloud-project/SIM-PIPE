import ExpiryMap from 'expiry-map';
import { expressjwt } from 'express-jwt';
import got from 'got';
import pMemoize from 'p-memoize';

/**
 * middleware definitions
 */
const KEYCLOAK_REALM_ENDPOINT = process.env.KEYCLOAK_REALM_ENDPOINT
  ?? 'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

async function getKeycloakPublicKey(): Promise<string> {
  const response = await got(KEYCLOAK_REALM_ENDPOINT).json<{ public_key: string }>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  return `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;
}

const authenticationExpiryTimeout: number = Number.parseInt(
  process.env.Authentication_Expiry_Timeout || '', 10);
const keycloakPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

const jwtMiddleware = expressjwt({
  secret: getKeycloakPublicKeyWithCache,
  algorithms: ['RS256'],
});

export default jwtMiddleware;
