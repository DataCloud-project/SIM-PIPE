// import { GraphQLClient } from 'graphql-request';
// import { graphQLClient, username } from '../stores/stores.js';
import Keycloak from 'keycloak-js';
import { keycloakHandler } from '../stores/stores.js';
import { browser } from '$app/environment';
import { get } from 'svelte/store';

let initKeycloakPromise: Promise<void> | undefined;

async function internalInitKeycloak(): Promise<void> {
    // TODO: call keycloak only if there is no token or current token is expired
    keycloakHandler.set(new Keycloak({
        url: 'https://datacloud-auth.euprojects.net/auth', // TODO - add env var
        realm: 'user-authentication',
        clientId: 'sim-pipe-web', // TODO - add env var
        // 'enable-cors': 'true', // TODO it seems to be ignored
    }));
    await get(keycloakHandler).init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
    
    if (!get(keycloakHandler).token) {
        throw new Error("Keycloak didn't return a valid token");
    }
    console.log('User is authenticated');

    // const requestHeaders = {
    //     authorization: `Bearer ${get(keycloakHandler).token}`,
    //     mode: 'cors',
    // };
    if (!get(keycloakHandler).idTokenParsed) {
        throw new Error("Keycloak didn't return a valid idTokenParsed");
    }
    if (typeof get(keycloakHandler)?.idTokenParsed.preferred_username !== 'string') {
        throw new TypeError("Keycloak didn't return a valid preferred_username");
    }
    // TODO: initialize graphqlclient and save in store
    //   username.set(keycloak.idTokenParsed.preferred_username);

    //   let graphqlUrl;
    //   if (config.SIM_PIPE_CONTROLLER_URL) {
    //     graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;
    //   } else if (/^localhost(:\d+)?$/.test(window.location.host)) {
    //     graphqlUrl = 'http://localhost:9000/graphql';
    //   } else {
    //     graphqlUrl = '/graphql';
    //   }
    //   graphQLClient.set(
    //     new GraphQLClient(graphqlUrl, {
    //       headers: requestHeaders,
    //     }),
    //   );
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