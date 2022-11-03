<script>
	import { getContext } from 'svelte';
	import { clicked_simulation, graphQLClient } from '../../stores/stores';
	import { get_simulation_query } from '../../queries/get_simulation.svelte';
	import Alert from './alert.svelte';
	const { open, close } = getContext('simple-modal');

	async function execute_refresh() {
		open(Alert, { message: '🎐 Refreshing' });
		setTimeout(function () {
			close();
		}, 400);
		const simulation_id = $clicked_simulation.simulation_id;
		const result = await $graphQLClient.request(get_simulation_query, { simulation_id });
		$clicked_simulation = result.Get_Simulation.simulations[0];
	}
</script>

<div style="padding:5px;">
	<button
		class="action_button back_button"
		style="background-image:url({'../../images/backbutton.png'}) ;"
	>
		<a href="/">Back</a>
	</button>
	<button title="Refresh" class="action_button back_button" on:click={execute_refresh}>
		<a href={`/${clicked_simulation.simulation_id}`}>⟳</a>
	</button>
</div>
