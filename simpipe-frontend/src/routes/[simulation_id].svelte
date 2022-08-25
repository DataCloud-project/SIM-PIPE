<script context="module">
	import { GraphQLClient } from 'graphql-request';
	import { get_simulation_query } from '../queries/get_simulation.svelte';
	import { get } from 'svelte/store';
	import { userid, graphQLClient } from '../stores/stores';

	// load details of the clicked simulation
	export async function load({ params }) {
		try {
			const { simulation_id } = params;
			const variables = { userid: get(userid), simulation_id }; // userid from access token
			const result = await get(graphQLClient).request(get_simulation_query, variables);
			const simulation = JSON.parse(result.Get_Simulation).simulations[0];
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

	dayjs.extend(relativeTime);

	import { show_usages, show_steps_list, clicked_simulation, clicked_run } from '../stores/stores';
	import Charts from './charts.svelte';

	export let simulation;
	$clicked_simulation = simulation;
	let time = dayjs($clicked_simulation.created).fromNow();
	// set show_usages and show_steps_list as false when page loads/reloads
	$show_usages = false;
	$show_steps_list = false;
</script>

<div class="simulation_header">	
	<h3> Simulation: {$clicked_simulation.name}  Created {time} 
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

{#if $show_usages && ($clicked_run.status==='completed' || $clicked_run.status==='active')}
	<div class="graph_slot">
		<Charts />
	</div>
{/if}

<style>
	.all_content_box {
		display: flex;
	}
	.simulation_header {
		margin-top: 20px;
		padding: 10px;
		border: 10px solid rgba(255, 255, 255, 0.2);
	}
	.list_border {
		margin-top: 40px;
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
