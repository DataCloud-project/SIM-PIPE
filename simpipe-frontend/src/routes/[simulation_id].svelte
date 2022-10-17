<script context="module">
	import { get_simulation_query } from '../queries/get_simulation.svelte';
	import { get } from 'svelte/store';
	import { graphQLClient, clicked_simulation } from '../stores/stores';

	// load details of the clicked simulation
	export async function load({ params }) {
		try {
			let { simulation_id } = params;
			// during refresh if simulation id is undefined
			if(simulation_id == 'undefined') {			
				simulation_id = get(clicked_simulation).simulation_id;
			}
			const variables = { simulation_id }; // userid from access token
			const result = await get(graphQLClient).request(get_simulation_query, variables);
			const simulation = result.Get_Simulation.simulations[0];
			return {
				props: {
					simulation
				}
			};
		} catch (error) {
			return {
				error: new Error(error.message),
				status: error.status
			};
		}
	}
</script>

<script>
	import Runs from './runs.svelte';
	import Steps from './steps.svelte';
	import Logs from './logs.svelte';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import dayjs from 'dayjs';
	import Modal from 'svelte-simple-modal';
	import Back from './modals/back.svelte';

	dayjs.extend(relativeTime);

	import { show_usages, show_steps_list, clicked_run } from '../stores/stores';
	import Charts from './charts.svelte';
  	import DeleteSimulationButton from './modals/delete_simulation_button.svelte';

	export let simulation;
	$clicked_simulation = simulation;
	let time = dayjs($clicked_simulation.created).fromNow();
	// set show_usages and show_steps_list as false when page loads/reloads
	$show_usages = false;
	$show_steps_list = false;
</script>

<Modal><Back /></Modal>
<div class="simulation_header">	
	<h3>  Simulation: <span style="color:darkseagreen">{$clicked_simulation.name}</span>  created {time} <Modal><DeleteSimulationButton /></Modal>
    </h3>   
</div>


<div class="all_content_box">
	<div class="list_border">
		<Runs />
	</div>

	{#if $show_steps_list}
		<div class="list_border">
			<Steps />
		</div>
	{/if}

	{#if $show_usages}
		<div class="log_details">
			<Logs />
		</div>
	{/if}
</div>

{#if $show_usages && ($clicked_run.status!='queued' || $clicked_run.status!='waiting')}
	<div class="graph_slot">
		<Charts />
	</div>
{/if}

<style>
	.all_content_box {
		display: flex;
	}
	.simulation_header {
		margin-top: 1px;
		padding: 1px;
		padding-left: 10px;
		width: 32%;
		border: 8px solid rgba(255, 255, 255, 0.2);
	}
	.list_border {
		margin-top: 30px;
		padding: 10px;
		border: 3px dashed rgba(255, 255, 255, 0.2);
		flex: 0.32;
		float: left;
	}

	.log_details {
		flex: 0.34;
		margin-top: 40px;
		float: left;
		border: 3px dashed rgba(255, 255, 255, 0.2);
		padding: 10px;
	}
	.graph_slot {
		width: 97%;
		padding: 10px;
		float: left;
		border: 3px dashed rgba(255, 255, 255, 0.2);
		background-color: white;
		margin-top: 40px;
	}
</style>
