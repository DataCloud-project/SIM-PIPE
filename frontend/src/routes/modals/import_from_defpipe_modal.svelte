<script>
	import { create_simulation_mutation } from '../../queries/create_simulation.svelte';
	import { all_simulations_query } from '../../queries/all_simulations.svelte';
	import { getContext } from 'svelte';
	import { simulations_list, graphQLClient, usertoken } from '../../stores/stores';
	import Alert from './alert.svelte';
	import { gql } from 'graphql-request';

	export const test = gql`
		query Test {
			Test
		}
	`;
	const { open, close } = getContext('simple-modal');
	const get_pipeline_from_defpipe = async () => {
		return await $graphQLClient.request(test);
	}

	const import_from_defpipe = async () => {
		// TODO: add call to get allvalues pipeline from def-pipe api
		var allvaluespipeline = await get_pipeline_from_defpipe();
		const headers = {};
		headers.mode = 'no-cors';
		// TODO: add call to get all pipelines of a user and choose a pipeline
		// TODO: change url to var 
		console.log('result2');
		var response = await fetch(`http://localhost:9005/convert/`, {
			method: 'POST',
			body: JSON.stringify({
				response:  allvaluespipeline.Test,
			}),
		});
		var result = await response.json();
		console.log(result);
		// call create simulation
		const name = result[1]['name'];
		const variables = {
			name,
			pipeline_description: JSON.stringify(result[1])
		};
		result = await $graphQLClient.request(create_simulation_mutation, variables);
		if (JSON.parse(result.Create_Simulation).code == 200) {
			open(Alert, { message: `🎐 Success! ${name} is created` });
			// refresh list of simulations after new simulation is created
			$simulations_list = await $graphQLClient.request(all_simulations_query);
		} else {
			open(Alert, { message: JSON.parse(result.Create_Simulation).message });
		}
		setTimeout(async function () {
			close();
		}, 1500);
	}
</script>

<div class="outer_modal_box">
	<button class="confirm_button" on:click={import_from_defpipe}> Import AllValues simulation </button>
</div>
