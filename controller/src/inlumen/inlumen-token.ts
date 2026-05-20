import { inlumenClientId, inlumenClientSecret, oauth2IssuerEndpoint } from '../config.js';

let cachedToken: string | undefined;
let tokenExpiresAt = 0;

/**
 * Returns a client-credentials access token for calling the inLUMEN API.
 *
 * The token is cached in memory until 30 s before its stated expiry so we
 * never send an expired token while also avoiding a new round-trip on every
 * request.
 *
 * Returns `undefined` when auth is not configured (dev / no-auth mode), so
 * callers can skip the Authorization header gracefully.
 */
// eslint-disable-next-line import/prefer-default-export
export async function getInlumenAccessToken(): Promise<string | undefined> {
  if (!oauth2IssuerEndpoint || !inlumenClientId || !inlumenClientSecret) {
    return undefined;
  }

  const now = Date.now();
  if (cachedToken !== undefined && now < tokenExpiresAt) {
    return cachedToken;
  }

  const tokenUrl = `${oauth2IssuerEndpoint}/protocol/openid-connect/token`;
  const response = await fetch(tokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: inlumenClientId,
      client_secret: inlumenClientSecret,
    }).toString(),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to obtain inLUMEN access token from Keycloak: HTTP ${response.status}`,
    );
  }

  const data = await response.json() as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  // Refresh 30 s before actual expiry to avoid races
  tokenExpiresAt = now + (data.expires_in - 30) * 1000;

  return cachedToken;
}
