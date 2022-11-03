<script>
	import { create_run_mutation } from '../../queries/create_run.svelte';
	import { get_simulation_query } from '../../queries/get_simulation.svelte';
	import { clicked_simulation, graphQLClient } from '../../stores/stores';
	import { getContext } from 'svelte';
	import Alert from './alert.svelte';
	import { init_keycloak } from '../keycloak.svelte';

	const { close, open } = getContext('simple-modal');

	const simulation_id = $clicked_simulation.simulation_id;
	let name = '';
	let files = [];
	let env_list_entries = [[]];
	let env_list = [[]];
	let pipeline_steps = $clicked_simulation.pipeline_description.steps;

	if (!pipeline_steps) {
		pipeline_steps = JSON.parse($clicked_simulation.pipeline_description).steps;
	}

	let timeout_values = [];
	let show_env_list = [];
	let arrow = { false: '↓', true: '↑' };
	pipeline_steps.forEach((step, index) => {
		show_env_list[index] = false;
		env_list_entries[index] = [];
		step.env.forEach((env) => {
			env_list_entries[index][env.split('=')[0]] = env.split('=')[1];
		});
	});
	function toggle_env_list(index) {
		show_env_list[index] = !show_env_list[index];
	}
	async function execute_create_run() {
		for (const [index, env_entry] of env_list_entries.entries()) {
			// formatting env list entries in the correct format
			env_list[index] = [];
			for (const key in env_entry) {
				env_list[index].push([key, env_entry[key]].join('='));
			}
			// checking timeout_values and resetting to 0 for undefined
			timeout_values[index] = parseInt(timeout_values[index]);
		}
		// get sample input files for the run
		let sampleInput = [];
		for (const [index, file] of Array.from(files).entries()) {
			sampleInput[index] = [];
			sampleInput[index].push(file.name);
			let text = await file.text();
			sampleInput[index].push(text);
		}
		// call create run with the entered details
		let variables = { simulation_id, name, sampleInput, env_list, timeout_values };
		let result;
		try {
			result = await $graphQLClient.request(create_run_mutation, variables);
			if (JSON.parse(result.Create_Run_WithInput).code == 200) {
				open(Alert, { message: '🎐 Success! New run created' });
				setTimeout(function () {
					close();
				}, 1000);
				// refresh run list when new run is created
				variables = { simulation_id };
				result = await $graphQLClient.request(get_simulation_query, variables);
				$clicked_simulation = result.Get_Simulation.simulations[0];
			} else {
				open(Alert, { message: '🎌 Failed! Error creating run' });
				setTimeout(function () {
					close();
				}, 1000);
			}
		} catch (error) {
			console.log('caught error in execute_create_run');
			console.log(error);
			// setTimeout(function(){console.log('sleeping');}, 5000);
			// init_keycloak();
			// return;
		}
		close();
	}
</script>

<div class="create_run_class">
	<h1 style="font-size:30px;">Enter details of run</h1>
	<div class="modal_box">
		<p style="font-size:18px;">
			<strong>Name of run: </strong><input bind:value={name} placeholder="Enter name" />
		</p>

		<p style="font-size:18px;"><strong>Upload sample input files for the run</strong></p>

		<input multiple type="file" bind:files />
		<br />
		{#each files || [] as file}
			<p><strong>{file.name}</strong>({file.size} bytes)</p>
		{/each}
		<br />
		<p style="font-size:18px;"><strong>Run configuration</strong></p>

		{#each pipeline_steps as step, index}
			<p style="margin-left:30px;">
				Enter <strong><span style="color:black;">{step.name}</span></strong> configuration
				<button class="toggle pointer" on:click={() => toggle_env_list(index)}
					>{arrow[show_env_list[index]]}</button
				>
			</p>
			{#if show_env_list[index]}
				{#each step.env as env}
					<p class="left-margin">
						{env.split('=')[0]}: <input bind:value={env_list_entries[index][env.split('=')[0]]} />
					</p>
					<!-- {env.split('=')[1] = env_value} -->
				{/each}
				<br />
				{#if pipeline_steps[pipeline_steps.length - 1].type == 'continuous'}
					<p class="left-margin">
						Timeout values for the step <input
							bind:value={timeout_values[index]}
							placeholder="Enter timeout in seconds"
						/>
					</p>
				{/if}
			{/if}
			<br />
		{/each}
	</div>

	<br />
	<p>
		<button class="cancel_button" on:click={() => close()}> Cancel </button>
		<button class="confirm_button" on:click={execute_create_run}> Create new run</button>
	</p>
	<br /><br />
</div>

<style>
	.toggle {
		background-color: rgb(218, 245, 254);
		font-size: 20px;
	}
	.create_run_class {
		background-color: white;
	}
	.left-margin {
		margin-left: 50px;
	}
	input,
	p,
	button {
		font-size: 16px;
		color: black;
		margin-left: 10px;
	}
	h1 {
		color: black;
	}
</style>
