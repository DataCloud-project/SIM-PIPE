<script>
	import { stop_run_mutation } from '../../queries/stop_run.svelte';
	import { clicked_run, graphQLClient } from '../../stores/stores';
	import Alert from './alert.svelte';
    import { getContext } from 'svelte';

    const { open, close } = getContext('simple-modal');

    async function execute_stop_run() {
		let result = await $graphQLClient.request(stop_run_mutation, { run_id:$clicked_run.run_id });
        if (JSON.parse(result.Stop_Run).code == 200) {
			open(Alert, { message: '🎐 Success! Stop signal has been sent to run' });
			setTimeout(function () {
				close();
			}, 1000);
		} else {
			open(Alert, { message: JSON.parse(result.Stop_Run).message });
			setTimeout(function () {
				close();
			}, 1000);
		}
    }
</script>

{#if $clicked_run.status == 'active' || $clicked_run.status == 'queued'}
    <button class="action_button stop_run" on:click="{execute_stop_run}">Stop run</button>
{/if}