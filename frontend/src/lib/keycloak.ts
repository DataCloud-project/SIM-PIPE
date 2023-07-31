import { GraphQLClient } from 'graphql-request';
import { graphQLClient, username } from '../stores/stores.js';
import { GraphQL_API_URL } from '../lib/config.js';
import Keycloak from 'keycloak-js';
import { browser } from '$app/environment';

let initKeycloakPromise: Promise<void> | undefined;

async function internalInitKeycloak(): Promise<void> {
	// TODO: call keycloak only if there is no token or current token is expired
	const keyCloak = new Keycloak({
		url: 'https://datacloud-auth.euprojects.net/auth', // TODO - add env var
		realm: 'user-authentication',
		clientId: 'sim-pipe-web' // TODO - add env var
		// 'enable-cors': 'true', // TODO it seems to be ignored
	});
	await keyCloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.

	if (keyCloak.token) {
		throw new Error("Keycloak didn't return a valid token");
	}
	console.log('User is authenticated');

	// const requestHeaders = {
	//     authorization: `Bearer ${get(keycloakHandler).token}`,
	//     mode: 'cors',
	// };
	if (!keyCloak.idTokenParsed) {
		throw new Error("Keycloak didn't return a valid idTokenParsed");
	}
	// TODO: Aleena change to authenticated when api is ready

	username.set(keyCloak.idTokenParsed.preferred_username);
	//   if (config.SIM_PIPE_CONTROLLER_URL) {
	//     graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;
	//   } else if (/^localhost(:\d+)?$/.test(window.location.host)) {
	//     graphqlUrl = 'http://localhost:9000/graphql';
	//   } else {
	//     graphqlUrl = '/graphql';
	//   }
	graphQLClient.set(new GraphQLClient(GraphQL_API_URL, {}));
}

export default async function initKeycloak(): Promise<void> {
	if (!browser) {
		return;
	}
	if (!initKeycloakPromise) {
		initKeycloakPromise = internalInitKeycloak();
	}
	await initKeycloakPromise;
}
