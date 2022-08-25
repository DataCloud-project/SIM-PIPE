<script>
	import { delete_run_mutation } from '../../queries/delete_run.svelte';
    import { get_simulation_query } from '../../queries/get_simulation.svelte';
	import { clicked_run, graphQLClient, clicked_simulation, userid, show_steps_list } from '../../stores/stores';
	import Alert from './alert.svelte';
    import { getContext } from 'svelte';

    const { open, close } = getContext('simple-modal');

    async function execute_delete_run() {
		let result = await $graphQLClient.request(delete_run_mutation, { run_id:$clicked_run.run_id, userid:$userid });
        if (JSON.parse(result.Delete_Run).code == 200) {
			open(Alert, { message: '🎐 Success! Run has been deleted' });
			await setTimeout(function(){close()}, 1000);
			// refresh run list after run is deleted
            let variables = { userid: $userid, simulation_id: $clicked_simulation.simulation_id }; // userid from access token
            result = await $graphQLClient.request( get_simulation_query, variables );
            $clicked_simulation = JSON.parse(result.Get_Simulation).simulations[0];
			$show_steps_list = false; // reset displayed steps
		} else {
			open(Alert, { message: JSON.parse(result.Delete_Run).message });
			await setTimeout(function(){close()}, 1000);
		}
    }
</script>

<button class="action_button delete_run" on:click="{execute_delete_run}">Delete run</button>

