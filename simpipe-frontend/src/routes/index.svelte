<script context="module">
	import { GraphQLClient } from 'graphql-request';
	import { all_simulations_query } from '../queries/all_simulations.svelte';
	import { userid } from '../stores/stores';
	import { get } from 'svelte/store';
	import Keycloak from 'keycloak-js';

	export const load = async () => {
		// Keycloak init
		try {
			let keycloak = new Keycloak({
				url: 'https://datacloud-auth.euprojects.net/auth', // todo - add env var
				realm: 'user-authentication',
				clientId: 'sim-pipe-web', // todo - add env var
				'enable-cors': 'true'
			});
			await keycloak.init({ onLoad: 'login-required', flow: 'implicit' }); //  Implicit flow. 
			console.log('User authenticated');
			userid.set(keycloak.subject);
		} catch (error) {
			console.log(error);
			console.log('failed to initialize');
		}
		const graphQLClient = new GraphQLClient('http://localhost:9000/graphql'); // todo - add config
		try {
			// await init_fn();
			const variables = { userid: get(userid) }; // userid from access token
			const simulations = await graphQLClient.request(all_simulations_query, variables);
			return {
				props: {
					simulations
				}
			};
		} catch (error) {
			return {
				error: new Error(error.message),
				status: error.status
			};
		}
	};
</script>

<script>
	import Modal from 'svelte-simple-modal';
	import CreateSimulationButton from './modals/create_simulation_button.svelte';
	import { simulations_list } from '../stores/stores';

	export let simulations;
	$: $simulations_list = simulations;
</script>

<div class="table_container">
	<br /><br />
	<ul class="max_width">
		<li class="table-header">Simulations</li>
		<br />
		{#each $simulations_list.All_Simulations.simulations as simulation}
			<li class="pointer row">
				<a href={`/${simulation.simulation_id}`}>
					{simulation.name}
				</a>
			</li>
		{/each}
	</ul>
	<br />
	<div class="create_sim_box">
		<p><Modal><CreateSimulationButton /></Modal></p>
		<br />
	</div>
</div>

<style>
	.create_sim_box {
		/* float: left; */
		margin-left: 40px;
	}
	.max_width {
		max-width: 25%;
	}
	.row {
		background-color: #ffffff;
		box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
	}

	a {
		color: black;
		font-size: 16px;
	}
</style>
