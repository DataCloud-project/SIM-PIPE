<script>
	import { all_simulations_query } from '../queries/all_simulations.svelte';
	import { graphQLClient } from '../stores/stores';
	import Modal from 'svelte-simple-modal';
	import CreateSimulationButton from './modals/create_simulation_button.svelte';
	import { simulations_list } from '../stores/stores';
	import { init_keycloak } from './utils/keycloak.svelte';
	import { get } from 'svelte/store';

	let simulations;
	let loading = async () => {
		try {
			await init_keycloak();
			simulations = await get(graphQLClient).request(all_simulations_query);
		} catch(e) {
			console.log(e);
			// console.log('🎌 Error! could not load simulations, retrying');
			simulations = 'error';
		}
	};
	loading();
	$: $simulations_list = simulations;
</script>

<!-- <div class="table_container">
	<br /><br />
	<ul class="max_width">
		<li class="table-header-simulations">My simulations</li>
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
</div> -->
<!-- <div class="center">
	<br /><br />
	<ul class="">
		<li class="">My simulations</li>
		<br />
		{#if !simulations}
			<p style="font-size:20px;">Loading simulations...</p>
		{:else if simulations === 'error'}
			<p style="font-size:20px;">🎌 Error! could not load simulations</p>
		{:else}
			{#each $simulations_list.All_Simulations.simulations as simulation}
				<li class="">
					<a href={`/${simulation.simulation_id}`}>
						{simulation.name}
					</a>
				</li>
			{/each}
		{/if}
	</ul>
	<br />
	
</div> -->
<div class="center">
	<p>My simulations<p>
	<br>
	<table>
		{#if !simulations}
			<p style="font-size:20px;">Loading simulations...</p>
		{:else if simulations === 'error'}
			<p style="font-size:20px;">🎌 Error! could not load simulations</p>
		{:else}
		<tr bgcolor="#3962a7">
			<th>Select</th>
			<th>Name</th>
			<th>Runs</th>
			<th>Date</th>
		</tr>
			{#each $simulations_list.All_Simulations.simulations as simulation}
			<tr>
				<td><input type="checkbox" name="field name" value="Initial value"></td>
				<td>
					<a href={`/${simulation.simulation_id}`}>
					{simulation.name}
					</a>
				</td>
				<td>
					<a href={`/${simulation.simulation_id}`}>
					{simulation.runs.length}
					</a>
				</td>
				<td>
					<a href={`/${simulation.simulation_id}`}>
					{simulation.created}
					</a>
				</td>
			</tr>	
			{/each}
		{/if}
	  </table>
	  <br>
	  <div class="create_sim_box">
		<p><Modal><CreateSimulationButton /></Modal></p>
		<br />
	</div>
</div>

<style>
	
	.center {
		margin: auto;
		width: 65%;
		padding: 10px;
	}

	table {
		font-family: arial, sans-serif;
		border-collapse: collapse;
		width: 100%;
	}

	td, th {
		text-align: left;
		padding: 8px;
	}

	tr:nth-child(even) {
		background-color: #241e1e;
	}
	tr:hover{
		background-color: #2c5479;
	}
	
</style>
