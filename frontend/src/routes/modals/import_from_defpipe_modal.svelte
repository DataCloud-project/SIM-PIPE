<!-- Integration with DEF-PIPE -->
<script>
	import { create_simulation_mutation } from '../../queries/create_simulation.svelte';
	import { all_simulations_query } from '../../queries/all_simulations.svelte';
	import { getContext } from 'svelte';
	import { simulations_list, graphQLClient } from '../../stores/stores';
	import Alert from './alert.svelte';
	import { import_pipeline_from_defpipe_query } from '../../queries/import_pipeline_from_defpipe.svelte';
	import {SIM_PIPE_CONVERTER_URL} from '../../config/config';
	export let all_currentuser_pipelines;
	const { open, close } = getContext('simple-modal');
	const get_pipeline_from_defpipe = async () => {
		return (await $graphQLClient.request(import_pipeline_from_defpipe_query, 
		{name: selected_pipeline})).ImportPipelineFromDEFPIPE;
	}
	
	let selected_pipeline = 'Select pipeline';
	
	const import_from_defpipe = async () => {
		var selected_pipeline_definition = await get_pipeline_from_defpipe();
		// convert xtext to internal json format
		var converted_pipeline = await fetch(`${SIM_PIPE_CONVERTER_URL}`, {
			method: 'POST',
			body: JSON.stringify({
				response:  selected_pipeline_definition,
			}),
		});
		converted_pipeline = await converted_pipeline.json();
		// check if conversion was succesful
		if(converted_pipeline[0] == 'error') {
			open(Alert, { message: '🎌 Failed! Selected pipeline definition is incomplete' });
			setTimeout(async function () {close();}, 1500);
			return;
		}
		// call create simulation with the converted pipeline description
		const name = converted_pipeline[1]['name'];
		const variables = {
			name,
			pipeline_description: JSON.stringify(converted_pipeline[1])
		};
		const result = await $graphQLClient.request(create_simulation_mutation, variables);
		if (JSON.parse(result.Create_Simulation).code == 200) {
			open(Alert, { message: `🎐 Success! ${name} is created` });
			// refresh list of simulations after new simulation is created
			$simulations_list = await $graphQLClient.request(all_simulations_query);
		} else {
			open(Alert, { message: JSON.parse(result.Create_Simulation).message });
		}
		setTimeout(async function () {close();}, 1500);
	}
</script>

<div class="outer_modal_box">
	<h1>Choose a pipeline to import:</h1>
	<br />
	<select bind:value={selected_pipeline}>
		<br />
		{#each all_currentuser_pipelines as value}
			<option value={value}>
				{value}
			</option>
		{/each}
		<br />
	</select>
	<br /> <br />
	<button class="confirm_button" on:click={import_from_defpipe}> Import pipeline </button>
</div>

<style>
	select, option {
		color: black;
		font-size: 22px;
	}
	h1 {
		color: black;
	}
</style>
