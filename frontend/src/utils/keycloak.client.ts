import { GraphQLClient } from 'graphql-request';
import Keycloak from 'keycloak-js';
import * as config from '../lib/config';
import { graphQLClient, username, usertoken } from '../stores/stores';
import { browser } from '$app/environment';

let initKeycloakPromise: Promise<void> | undefined;

function parseSimPipeEnvironment(): {
	keycloakEnabled: boolean;
	graphqlUrl: string;
} {

	let keycloakEnabled = config.KEYCLOAK_ENABLED;
	let graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;

	if (keycloakEnabled === undefined || graphqlUrl === undefined) {

		const localhostMatch = window.location.host.match(/^(localhost|127\.0\.0\.\d+|::1)(:\d+)?$/);

		if (localhostMatch) {
			keycloakEnabled = keycloakEnabled === undefined ? false : keycloakEnabled === 'true';
			if (graphqlUrl === undefined) {
				const port = localhostMatch[2];
				if (port === ':8088') {
					graphqlUrl = 'http://localhost:8087/graphql';
				} else {
					graphqlUrl = 'http://localhost:9000/graphql';
				}
			}
		} else {
			keycloakEnabled = keycloakEnabled === undefined ? true : keycloakEnabled === 'true';
			graphqlUrl = '/graphql';
		}
	}

	return {
		keycloakEnabled,
		graphqlUrl
	};

}


async function internalInitKeycloak(graphqlUrl: string): Promise<void> {
	const keycloak = new Keycloak({
		url: config.KEYCLOAK_URL,
		realm: config.KEYCLOAK_REALM,
		clientId: config.KEYCLOAK_CLIENT_ID,
		// 'enable-cors': 'true', // it seems to be ignored
	});
	await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
	if (!keycloak.token) {
		throw new Error("Keycloak didn't return a valid token");
	}
	// console.log('User is authenticated');
	const requestHeaders = {
		authorization: `Bearer ${keycloak.token}`,
		mode: 'cors'
	};
	if (!keycloak.idTokenParsed) {
		throw new Error("Keycloak didn't return a valid idTokenParsed");
	}
	if (typeof keycloak.idTokenParsed.preferred_username !== 'string') {
		throw new TypeError("Keycloak didn't return a valid preferred_username");
	}
	usertoken.set(keycloak.token);
	username.set(keycloak.idTokenParsed.preferred_username);

	graphQLClient.set(
		new GraphQLClient(graphqlUrl, {
			headers: requestHeaders
		})
	);
}

export default async function initKeycloak(): Promise<void> {
	if (!browser) {
		return;
	}

	const { keycloakEnabled, graphqlUrl } = parseSimPipeEnvironment();
	if (!keycloakEnabled) {
		graphQLClient.set(
			new GraphQLClient(graphqlUrl, {}),
		);
		return;
	}
	if (!initKeycloakPromise) {
		initKeycloakPromise = internalInitKeycloak(graphqlUrl);
	}
	await initKeycloakPromise;
}
