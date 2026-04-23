import { GraphQLClient } from 'graphql-request';
import Keycloak from 'keycloak-js';
import * as config from '../lib/config';
import { graphQLClient, username, usertoken } from '../stores/stores';
import { browser } from '$app/environment';

let initKeycloakPromise: Promise<void> | undefined;
let keycloakInstance: Keycloak | undefined;

// Forces an unconditional token refresh regardless of local expiry.
// Call this when the server has explicitly rejected the current token (e.g. 401).
export async function forceRefreshToken(): Promise<void> {
	if (!keycloakInstance || !browser) return;
	try {
		// updateToken(-1) forces a refresh even if the token is still locally valid.
		const refreshed = await keycloakInstance.updateToken(-1);
		if (refreshed && keycloakInstance.token) {
			const { token } = keycloakInstance;
			const exp = keycloakInstance.tokenParsed?.exp ?? 0;
			window.sessionStorage.setItem('keycloak-token', token);
			window.sessionStorage.setItem('keycloak-exp', exp.toString());
			window.sessionStorage.setItem('keycloak-refresh-token', keycloakInstance.refreshToken ?? '');
			usertoken.set(token);
		}
	} catch {
		// Refresh token expired — clear cache and force re-login
		window.sessionStorage.removeItem('keycloak-token');
		window.sessionStorage.removeItem('keycloak-exp');
		window.sessionStorage.removeItem('keycloak-refresh-token');
		const cleanUri = `${window.location.origin}${window.location.pathname}`;
		await keycloakInstance.login({ redirectUri: cleanUri });
		await new Promise<never>(() => {});
	}
}

export async function ensureFreshToken(): Promise<void> {
	if (!keycloakInstance || !browser) return;
	try {
		const refreshed = await keycloakInstance.updateToken(30);
		if (refreshed && keycloakInstance.token) {
			const { token } = keycloakInstance;
			const exp = keycloakInstance.tokenParsed?.exp ?? 0;
			window.sessionStorage.setItem('keycloak-token', token);
			window.sessionStorage.setItem('keycloak-exp', exp.toString());
			window.sessionStorage.setItem('keycloak-refresh-token', keycloakInstance.refreshToken ?? '');
			usertoken.set(token);
		}
	} catch {
		// Refresh token expired — clear cache and force re-login
		window.sessionStorage.removeItem('keycloak-token');
		window.sessionStorage.removeItem('keycloak-exp');
		window.sessionStorage.removeItem('keycloak-refresh-token');
		const cleanUri = `${window.location.origin}${window.location.pathname}`;
		await keycloakInstance.login({ redirectUri: cleanUri });
		await new Promise<never>(() => {});
	}
}

// Returns a fresh access token, refreshing via Keycloak if within 30 s of expiry.
// Falls back to sessionStorage when keycloakInstance is not yet set (non-browser or SSR).
export async function getLatestToken(): Promise<string | undefined> {
	if (!browser) return undefined;
	if (keycloakInstance) {
		try {
			await keycloakInstance.updateToken(30);
		} catch {
			// Refresh token expired — force re-login
			window.sessionStorage.removeItem('keycloak-token');
			window.sessionStorage.removeItem('keycloak-exp');
			window.sessionStorage.removeItem('keycloak-refresh-token');
			const cleanUri = `${window.location.origin}${window.location.pathname}`;
			await keycloakInstance.login({ redirectUri: cleanUri });
			await new Promise<never>(() => {});
		}
		const t = keycloakInstance.token;
		if (t) {
			window.sessionStorage.setItem('keycloak-token', t);
			window.sessionStorage.setItem('keycloak-exp', String(keycloakInstance.tokenParsed?.exp ?? 0));
			window.sessionStorage.setItem('keycloak-refresh-token', keycloakInstance.refreshToken ?? '');
		}
		return t;
	}
	return window.sessionStorage.getItem('keycloak-token') ?? undefined;
}

// Creates a GraphQLClient whose every request dynamically injects a fresh Bearer token
// via requestMiddleware — avoids stale static headers and concurrent-refresh races.
function createGraphQLClientWithMiddleware(graphqlUrl: string): GraphQLClient {
	return new GraphQLClient(graphqlUrl, {
		requestMiddleware: async (request): Promise<typeof request> => {
			const token = await getLatestToken();
			return {
				...request,
				headers: {
					...(request.headers as Record<string, string>),
					...(token ? { authorization: `Bearer ${token}` } : {})
				}
			};
		}
	});
}

function parseSimPipeEnvironment(): {
	keycloakEnabled: boolean;
	graphqlUrl: string;
} {
	let graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;
	let keycloakEnabled = config.KEYCLOAK_ENABLED;
	let isKeycloakEnabled = false;

	if (graphqlUrl === undefined) {
		const localhostMatch = window.location.host.match(/^(localhost|127\.0\.0\.\d+|::1)(:\d+)?$/);

		if (localhostMatch) {
			const port = localhostMatch[2];
			// added 5173 to support deployment of frontend in dev mode
			// eslint-disable-next-line unicorn/prefer-ternary
			if (port === ':8088') {
				console.log('localhost:', localhostMatch[1], 'port:', port);
				graphqlUrl = 'http://localhost:8087/graphql';
			} else if (port === ':5173') {
				console.log('localhost:', localhostMatch[1], 'port:', port);
				graphqlUrl = 'http://localhost:9000/graphql';
			} else {
				console.log("localhost match didn't match any known port", port);
				graphqlUrl = 'http://localhost:9000/graphql';
				console.log('Using default graphqlUrl', graphqlUrl);
			}
		} else {
			graphqlUrl = '/graphql';
		}
	}

	if (keycloakEnabled === undefined) {
		const localhostMatch = window.location.host.match(/^(localhost|127\.0\.0\.\d+|::1)(:\d+)?$/);
		keycloakEnabled = localhostMatch ? 'false' : 'true';
	}

	isKeycloakEnabled = keycloakEnabled === 'true';

	return {
		keycloakEnabled: isKeycloakEnabled,
		graphqlUrl
	};
}

async function internalInitKeycloak(graphqlUrl: string): Promise<void> {
	// Fast path: reuse a cached token that is still valid.
	const existingToken = window.sessionStorage.getItem('keycloak-token');
	if (existingToken) {
		const existingExp = window.sessionStorage.getItem('keycloak-exp');
		if (existingExp) {
			const exp = Number.parseInt(existingExp, 10);
			if (exp - Date.now() / 1000 > 30) {
				console.log('[keycloak] Using cached token, expires:', new Date(exp * 1000).toISOString());
				// Restore the Keycloak instance from saved tokens so updateToken() works
				// when the access token later expires (prevents ensureFreshToken no-op).
				const savedRefreshToken = window.sessionStorage.getItem('keycloak-refresh-token');
				const keycloak = new Keycloak({
					url: config.KEYCLOAK_URL,
					realm: config.KEYCLOAK_REALM,
					clientId: config.KEYCLOAK_CLIENT_ID
				});
				await keycloak.init({
					checkLoginIframe: false,
					useNonce: false,
					token: existingToken,
					refreshToken: savedRefreshToken ?? undefined
				});
				keycloakInstance = keycloak;
				usertoken.set(existingToken);
				username.set(window.sessionStorage.getItem('keycloak-username') ?? '');
				graphQLClient.set(createGraphQLClientWithMiddleware(graphqlUrl));
				return;
			}
		}
	}

	console.log('[keycloak] No valid cached token, creating Keycloak instance...');
	const keycloak = new Keycloak({
		url: config.KEYCLOAK_URL,
		realm: config.KEYCLOAK_REALM,
		clientId: config.KEYCLOAK_CLIENT_ID
	});

	// Loop prevention: track how many times we've redirected to Keycloak.
	// If we keep getting redirected back without successfully authenticating,
	// stop after 2 attempts and surface the error.
	const redirectKey = 'keycloak-redirect-count';
	const redirectCount = Number.parseInt(window.sessionStorage.getItem(redirectKey) ?? '0', 10);

	const isCallback =
		window.location.search.includes('code=') ||
		window.location.search.includes('error=') ||
		window.location.hash.includes('code=') ||
		window.location.hash.includes('error=');

	// keycloak-js init options:
	// - No onLoad: we manage redirect logic ourselves (avoids loops and iframe errors)
	// - useNonce: false — keycloak-js v23 validates nonce across access, refresh, AND
	//   id tokens. If any token's nonce doesn't match, init fails with "Invalid nonce".
	//   PKCE (S256) already provides equivalent replay protection, so nonce is redundant.
	// - responseMode: 'query' — SvelteKit's router can interfere with fragment-based
	//   callbacks; query params are safer.
	await keycloak.init({
		checkLoginIframe: false,
		pkceMethod: 'S256',
		responseMode: 'query',
		useNonce: false,
		enableLogging: true
	});

	if (!keycloak.authenticated) {
		if (redirectCount >= 2) {
			window.sessionStorage.removeItem(redirectKey);
			throw new Error(
				'Authentication failed after multiple attempts. Check Keycloak client ' +
					'settings: Web origins must include http://localhost:8088, redirect URI ' +
					'must include http://localhost:8088/*.'
			);
		}
		console.log(
			'[keycloak] Not authenticated — redirecting to login (attempt',
			redirectCount + 1,
			')...'
		);
		window.sessionStorage.setItem(redirectKey, String(redirectCount + 1));
		const cleanUri = `${window.location.origin}${window.location.pathname}`;
		await keycloak.login({ redirectUri: cleanUri });
		await new Promise<never>(() => {});
		return;
	}

	// Success — clear redirect counter.
	window.sessionStorage.removeItem(redirectKey);

	if (!keycloak.token) {
		console.error('[keycloak] authenticated but token is falsy:', keycloak.token);
		throw new Error("Keycloak didn't return a valid token");
	}

	// Prefer idTokenParsed.preferred_username; fall back to tokenParsed (access token).
	const preferredUsername =
		(keycloak.idTokenParsed?.preferred_username as string | undefined) ??
		(keycloak.tokenParsed?.preferred_username as string | undefined);

	console.log('[keycloak] preferredUsername:', preferredUsername);

	if (typeof preferredUsername !== 'string') {
		console.error(
			// eslint-disable-next-line no-useless-concat
			'[keycloak] preferred_username missing.\n' + '  idTokenParsed:',
			JSON.stringify(keycloak.idTokenParsed),
			// eslint-disable-next-line no-useless-concat
			'\n' + '  tokenParsed:',
			JSON.stringify(keycloak.tokenParsed)
		);
		throw new Error(
			'preferred_username claim is missing from the Keycloak token. ' +
				'In Keycloak Admin → Clients → sim-pipe-web → Client Scopes, ' +
				'move the "profile" scope from Optional to Default.'
		);
	}

	const { token } = keycloak;
	const exp = keycloak.tokenParsed?.exp ?? 0;

	console.log('[keycloak] Token expires at', new Date(exp * 1000).toISOString());

	window.sessionStorage.setItem('keycloak-token', token);
	window.sessionStorage.setItem('keycloak-exp', exp.toString());
	window.sessionStorage.setItem('keycloak-username', preferredUsername);
	window.sessionStorage.setItem('keycloak-refresh-token', keycloak.refreshToken ?? '');

	usertoken.set(token);
	username.set(preferredUsername);
	keycloakInstance = keycloak;
	graphQLClient.set(createGraphQLClientWithMiddleware(graphqlUrl));
	console.log('[keycloak] graphQLClient set successfully');
}

export default async function initKeycloak(): Promise<void> {
	if (!browser) {
		return;
	}

	const { keycloakEnabled, graphqlUrl } = parseSimPipeEnvironment();
	if (!keycloakEnabled) {
		graphQLClient.set(new GraphQLClient(graphqlUrl, {}));
		return;
	}
	if (!initKeycloakPromise) {
		initKeycloakPromise = internalInitKeycloak(graphqlUrl).catch((error) => {
			// Reset the memo so a future call can retry instead of replaying
			// the same rejected promise forever.
			initKeycloakPromise = undefined;
			throw error;
		});
	}
	await initKeycloakPromise;
}
