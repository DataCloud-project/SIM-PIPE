<script>
	import { start_run_mutation } from '../../queries/start_run.svelte';
    import { get_simulation_query } from '../../queries/get_simulation.svelte';
	import { clicked_run, graphQLClient, clicked_simulation, steps_list } from '../../stores/stores';
	import Alert from './alert.svelte';
    import { getContext } from 'svelte';

    const { open, close } = getContext('simple-modal');
    const simulation_id = $clicked_simulation.simulation_id;

    async function refresh_runs() {
        return new Promise(function (resolve) {
            (async function wait_for_completion(){
                const result = await $graphQLClient.request( get_simulation_query, { simulation_id } );
                $clicked_simulation = result.Get_Simulation.simulations[0];
                $clicked_simulation.runs.every(run => {
                    if(run.run_id === $clicked_run.run_id) {
                        $clicked_run = run;
                        return false;
                    }
                    return true;
                });
                $steps_list = $clicked_run.steps;
                if ($clicked_run.status != 'active' && $clicked_run.status != 'waiting' ) 
                    return resolve();
                // update steps list
                setTimeout(wait_for_completion, 5000);
            })();
        });
    }
    async function execute_start_run() {
		let result = await $graphQLClient.request(start_run_mutation, { run_id:$clicked_run.run_id });
        if (JSON.parse(result.Start_Run).code == 200) {
			open(Alert, { message: '🎐 Success! Run has been added to the queue' });
			setTimeout(function () {
				close();
			}, 1000);
            // poll status of run after every 5 seconds until it is not active            
            await setTimeout(refresh_runs, 4000);
		} else {
			open(Alert, { message: JSON.parse(result.Start_Run).message });
			setTimeout(function () {
				close();
			}, 1000);
		}
    }
</script>

{#if $clicked_run.status == 'waiting'}
    <button class="action_button start_run" on:click="{execute_start_run}"> Start run</button>
{/if}
