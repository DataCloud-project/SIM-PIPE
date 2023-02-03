<script>
	import { create_simulation_mutation } from '../../queries/create_simulation.svelte';
	import { all_simulations_query } from '../../queries/all_simulations.svelte';
	import { getContext } from 'svelte';
	import { simulations_list, graphQLClient } from '../../stores/stores';
	import Alert from './alert.svelte';

	const { open, close } = getContext('simple-modal');

	const import_from_defpipe = async () => {
		var response = await fetch('http://localhost:9005/convert/?response=%7B%20%20%20%22data%22%3A%20%22Pipeline%20AllValues%20%7B%5Cn%5CtcommunicationMedium%3A%20medium%20%5Cn%5Ctsteps%3A%5Cn%5Ct%5Ct-%20data-source%20step%20Process%5Cn%5Ct%5Ct%5Ctimplementation%3A%20container-implementation%20image%3A%20%27name1.io%3Alastest%27%5Cn%5Ct%5Ct%5CtenvironmentParameters%3A%20%7B%5Cn%5Ct%5Ct%5Ct%5Ctkey1%3A%20%27value1%27%2C%5Cn%5Ct%5Ct%5Ct%5Ctkey2%3A%20%27value2%27%5Cn%5Ct%5Ct%5Ct%7D%5Cn%5Ct%5Ct%5CtresourceProvider%3A%20Accesspoint%5Cn%5Ct%5Ct%5CtexecutionRequirement%3A%5Cn%5Ct%5Ct%5Ct%5CthardRequirements%3A%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Cn%5Cn%5Ct%5Ct-%20data-source%20step%20source%5Cn%5Ct%5Ct%5Ctimplementation%3A%20container-implementation%20image%3A%20%27name2.io%3Alastest%27%5Cn%5Ct%5Ct%5CtenvironmentParameters%3A%20%7B%5Cn%5Ct%5Ct%5Ct%5Ctkey11%3A%20%27value11%27%2C%5Cn%5Ct%5Ct%5Ct%5Ctkey22%3A%20%27value22%27%5Cn%5Ct%5Ct%5Ct%7D%5Cn%5Ct%5Ct%5CtresourceProvider%3A%20Accesspoint%5Cn%5Ct%5Ct%5CtexecutionRequirement%3A%5Cn%5Ct%5Ct%5Ct%5CthardRequirements%3A%5Ct%5Ct%5Ct%5Ct%5Ct%5Cn%5Ct%5Ct%5Ct%5Ct%5CthorizontalScale%3A%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctmin-instance%3A%201%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctmax-instance%3A%205%5Cn%5Cn%5Ct%5Ct%5Ct%5Ct%5CtqualitativeRequirement%3A%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctmin-benchmark%3A%200%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctmax-benchmark%3A%2010%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctcpu-architecture%3A%20%27amd64%27%5Cn%5Ct%5Ct%5Ct%5Ct%5Ct%5Ctgpu-architecture%3A%20%27a89%27%5Cn%5Cn%7D%5Cn%5Cn%22%2C%20%20%20%22success%22%3A%20true%2C%20%20%20%22errorMessage%22%3A%20null%20%7D');
		var result = await response.json();

		// call create simulation
		let variables = {
			name: result[1]['name'],
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
	<button class="confirm_button" on:click={import_from_defpipe}> WIP Import simulation </button>
</div>
