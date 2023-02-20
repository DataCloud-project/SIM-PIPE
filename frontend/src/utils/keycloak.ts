import { GraphQLClient } from 'graphql-request';
import Keycloak from 'keycloak-js';
import * as config from '../config/config.js';
import { graphQLClient, username, usertoken } from '../stores/stores.js';
// eslint-disable-next-line import/extensions
import { browser } from '$app/environment';

let initKeycloakPromise: Promise<void> | undefined;

async function internalInitKeycloak(): Promise<void> {
  const keycloak = new Keycloak({
    url: 'https://datacloud-auth.euprojects.net/auth', // todo - add env var
    realm: 'user-authentication',
    clientId: 'sim-pipe-web', // todo - add env var
    // 'enable-cors': 'true', // TODO it seems to be ignored
  });
  await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
  if (!keycloak.token) {
    throw new Error("Keycloak didn't return a valid token");
  }
  // console.log('User is authenticated');
  const requestHeaders = {
    authorization: `Bearer ${keycloak.token}`,
    mode: 'cors',
  };
  if (!keycloak.idTokenParsed) {
    throw new Error("Keycloak didn't return a valid idTokenParsed");
  }
  if (typeof keycloak.idTokenParsed.preferred_username !== 'string') {
    throw new TypeError("Keycloak didn't return a valid preferred_username");
  }
  usertoken.set(keycloak.token);
  username.set(keycloak.idTokenParsed.preferred_username);

  let graphqlUrl;
  if (config.SIM_PIPE_CONTROLLER_URL) {
    graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;
  } else if (/^localhost(:\d+)?$/.test(window.location.host)) {
    graphqlUrl = 'http://localhost:9000/graphql';
  } else {
    graphqlUrl = '/graphql';
  }
  graphQLClient.set(
    new GraphQLClient(graphqlUrl, {
      headers: requestHeaders,
    }),
  );
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
