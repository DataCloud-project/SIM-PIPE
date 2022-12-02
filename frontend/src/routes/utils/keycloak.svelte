<script context="module">
	import { GraphQLClient } from 'graphql-request';
	import Keycloak from 'keycloak-js';
	import { graphQLClient, username } from '../../stores/stores';
	import * as config from '../../config/config';

	export async function init_keycloak() {
		try {
			let keycloak = new Keycloak({
				url: 'https://datacloud-auth.euprojects.net/auth', // todo - add env var
				realm: 'user-authentication',
				clientId: 'sim-pipe-web', // todo - add env var
				'enable-cors': 'true'
			});
			await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
			console.log('User is authenticated');
			const requestHeaders = {
				authorization: 'Bearer ' + keycloak.token,
				mode: 'cors'
			};
			username.set(keycloak.idTokenParsed.preferred_username);

			let graphqlUrl;
			if(config.SIM_PIPE_CONTROLLER_URL === '') {
				if (/^localhost(:\d+)?$/.test(window.location.host)) {
					graphqlUrl = 'http://localhost:9000/graphql';
				} else {
					graphqlUrl = '/graphql';
				}
			} else { // TODO move to env
				graphqlUrl = config.SIM_PIPE_CONTROLLER_URL;	
				graphQLClient.set(
					new GraphQLClient(graphqlUrl, {
						headers: requestHeaders
					})
				);	
			} 
		} catch {
			// error handled in index file 
		}
	}
</script>
