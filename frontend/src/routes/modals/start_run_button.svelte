<script>
	import { start_run_mutation } from '../../queries/start_run.svelte';
	import { clicked_run, graphQLClient } from '../../stores/stores';
	import Alert from './alert.svelte';
	import { getContext } from 'svelte';
	import { refresh_active_runs } from '../utils/refresh_runs.svelte';

	const { open, close } = getContext('simple-modal');

	async function execute_start_run() {
		let result = await $graphQLClient.request(start_run_mutation, { run_id: $clicked_run.run_id });
		if (JSON.parse(result.Start_Run).code == 200) {
			open(Alert, { message: `🎐 Success! ${$clicked_run.name} has been added to the queue` });
			setTimeout(function () {
				close();
			}, 1500);
			// refresh the runs until there are no active runs
			setTimeout(refresh_active_runs, 4000);
		} else {
			open(Alert, { message: JSON.parse(result.Start_Run).message });
			setTimeout(function () {
				close();
			}, 1000);
		}
	}
</script>

{#if $clicked_run.status == 'waiting'}
	<button title="Start run" class="action_button start_run" on:click={execute_start_run}>
		▶
	</button>
{/if}
