<script context="module">
	import { GraphQLClient } from 'graphql-request';
	import Keycloak from 'keycloak-js';
	import { graphQLClient, username } from '../stores/stores';

	export async function init_keycloak() {
		try {
			let keycloak = new Keycloak({
				url: 'https://datacloud-auth.euprojects.net/auth', // todo - add env var
				realm: 'user-authentication',
				clientId: 'sim-pipe-web', // todo - add env var
				'enable-cors': 'true'
			});
			await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
			console.log('User authenticated');
			const requestHeaders = {
				authorization: 'Bearer ' + keycloak.token,
				mode: 'cors'
			};
			username.set(keycloak.idTokenParsed.preferred_username);
			// todo - add confi
			graphQLClient.set(
				new GraphQLClient('http://localhost:9000/graphql', {
					headers: requestHeaders
				})
			);
		} catch {}
	}
</script>
