<script>
	import { all_simulations_query } from '../queries/all_simulations.svelte';
	import { graphQLClient } from '../stores/stores';
	import { get } from 'svelte/store';
	import Modal from 'svelte-simple-modal';
	import CreateSimulationButton from './modals/create_simulation_button.svelte';
	import { simulations_list } from '../stores/stores';
	import { init_keycloak } from './keycloak.svelte';
	
	let simulations;	
	let loading = async () => {
		try {
			await init_keycloak();
			simulations = await get(graphQLClient).request(all_simulations_query);
		} catch {
			console.log('🎌 Error! could not load simulations');
			simulations = 'error';
		}
	};
	loading();
	$: $simulations_list = simulations;
</script>

<div class="table_container">
	<br /><br />
	<ul class="max_width">
		<li class="table-header-simulations">Simulations</li>
		<br />
		{#if !simulations}
			<p style="font-size:20px;">Loading simulations...</p>
		{:else if simulations === 'error'}
			<p style="font-size:20px;">🎌 Error! could not load simulations</p>
		{:else}
			{#each $simulations_list.All_Simulations.simulations as simulation}
				<li class="pointer row">
					<a href={`/${simulation.simulation_id}`}>
						{simulation.name}
					</a>
				</li>
			{/each}
		{/if}
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
		font-size: 22px;
	}
</style>
