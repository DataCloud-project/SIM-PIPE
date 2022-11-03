<script>
	import { create_simulation_mutation } from '../../queries/create_simulation.svelte';
	import { all_simulations_query } from '../../queries/all_simulations.svelte';
	import { getContext } from 'svelte';
	import { simulations_list, graphQLClient } from '../../stores/stores';
	import Alert from './alert.svelte';

	const { open, close } = getContext('simple-modal');
	let name = '';
	let files;

	async function execute_create_simulation() {
		let pipeline_description = await files[0].text();

		// call create simulation
		let variables = {
			name,
			pipeline_description
		};
		let result = await $graphQLClient.request(create_simulation_mutation, variables);
		if (JSON.parse(result.Create_Simulation).code == 200) {
			open(Alert, { message: '🎐 Success! New simulation created' });
			setTimeout(function () {
				close();
			}, 1000);
			// refresh list of simulations after new simulation is created
			$simulations_list = await $graphQLClient.request(all_simulations_query);
		} else {
			open(Alert, { message: '🎌 Failed! Error creating simulation' });
			setTimeout(function () {
				close();
			}, 1000);
		}
		close();
	}
</script>

<div class="outer_modal_box">
	<h1>Enter details of simulation</h1>
	<div class="modal_box">
		<p><strong>Name: </strong><input bind:value={name} placeholder="Enter name" /></p>

		<!-- <p><strong>Model id:</strong> <input bind:value={model_id} /></p> -->
		<p><strong>Upload pipeline description </strong></p>
		<input type="file" bind:files />
		<br /><br />
	</div>

	<br />
	<p>
		<button class="cancel_button" on:click={() => close()}> Cancel </button>
		<button class="confirm_button" on:click={execute_create_simulation}> Create simulation </button>
	</p>
	<br /><br />
</div>

<style>
	input,
	p {
		font-size: 18px;
		color: black;
		margin-left: 10px;
	}
	h1 {
		color: black;
	}
</style>
