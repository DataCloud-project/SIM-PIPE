<script>
	import { getContext } from 'svelte';
	import { clicked_simulation, graphQLClient, clicked_run, steps_list } from '../../../stores/stores';
	import { get_simulation_query } from '../../../queries/get_simulation.svelte';
	import Alert from '../alert.svelte';
	import { goto } from '$app/navigation';

	const { open, close } = getContext('simple-modal');

	async function execute_refresh() {
		open(Alert, { message: '🎐 Refreshing' });
		setTimeout(function () {
			close();
		}, 400);
		const simulation_id = $clicked_simulation.simulation_id;
		try {
			const result = await $graphQLClient.request(get_simulation_query, { simulation_id });
			$clicked_simulation = result.Get_Simulation.simulations[0];
			if ($clicked_run !== '') {
				$steps_list = $clicked_run.steps;
			}
		} catch {
			open(Alert, { message: '⛓ You have been signed out' });
			setTimeout(function () {
				close();
				goto('/');
			}, 500);
			console.log('Error in execute_refresh');
			console.log('JWT token expired while executing refresh, redirecting to login page');
		}
	}
</script>

<div style="padding:5px;">
	<button class="action_button back_button">
		<a href="/">Back</a>
	</button>
	<button title="Refresh" class="action_button back_button" on:click={execute_refresh}>
		<a href={`/${clicked_simulation.simulation_id}`}>⟳</a>
	</button>
</div>
