<script>
	import Keycloak from 'keycloak-js';
    import { goto } from "$app/navigation";
    import { ProgressRadial } from '@skeletonlabs/skeleton';

	export async function init_keycloak() {
		try {
			let keycloak = new Keycloak({
				url: 'https://datacloud-auth.euprojects.net/auth', // todo - add env var
				realm: 'user-authentication',
				clientId: 'sim-pipe-web', // todo - add env var
				// 'enable-cors': 'true'
			});
			await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow.
			console.log('User is authenticated');
            goto('/projects');
		} catch {
			console.log('Error in keycloak authentication');
		}
	}
    init_keycloak();
</script>

<div class="flex place-content-center p-60 ">
    <ProgressRadial />
</div>