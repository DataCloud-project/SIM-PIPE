<script context="module">
	import { steps_list, clicked_run, clicked_simulation, graphQLClient } from '../../stores/stores';
	import { get_simulation_query } from '../../queries/get_simulation.svelte';
	import { get } from 'svelte/store';

	export async function refresh_active_runs() {
		const simulation_id = get(clicked_simulation).simulation_id;
		return new Promise(function (resolve) {
			(async function wait_for_completion() {
				const result = await get(graphQLClient).request(get_simulation_query, { simulation_id });
				clicked_simulation.set(result.Get_Simulation.simulations[0]);
				// update steps list
				if (get(clicked_run) !== '') {
					get(clicked_simulation).runs.every((run) => {
						if (run.run_id === get(clicked_run).run_id) {
							clicked_run.set(run);
							return false;
						}
						return true;
					});
					steps_list.set(get(clicked_run).steps);
				}
				const no_active_runs_indicator = get(clicked_simulation).runs.every((run) => {
					if (run.status === 'active' || run.status === 'queued') {
						return false;
					}
					return true;
				});

				if (no_active_runs_indicator) return resolve();
				setTimeout(wait_for_completion, 5000);
			})();
		});
	}
</script>
