<script>
	import Scroll from './scroll.svelte';
	import {
		show_usages,
		steps_list,
		clicked_step,
		show_steps_list,
		clicked_run,
		clicked_simulation
	} from '../stores/stores';
	import dayjs from 'dayjs';
	import Modal from 'svelte-simple-modal';
	import CreateRunButton from './modals/create_run_button.svelte';
	import StartRunButton from './modals/start_run_button.svelte';
	import StopRunButton from './modals/stop_run_button.svelte';
	import DeleteRunButton from './modals/delete_run_button.svelte';
	import { refresh_active_runs } from './utils/refresh_runs.svelte';

	let data = [];
	$clicked_run = '';

	function display_run_msg(run) {
		if (run.status == 'completed') {
			return `Completed ${dayjs(run.ended).from(run.started)}`;
		} else if (run.status == 'active') {
			return `Running since ${dayjs(run.started).fromNow()}`;
		} else if (run.status == 'failed') {
			return `Failed ${dayjs(run.started).fromNow()}`;
		} else if (run.status == 'cancelled') {
			return `Cancelled ${dayjs(run.started).fromNow()}`;
		} else if (run.status == 'waiting') {
			return `Waiting since ${dayjs(run.created).fromNow()}`;
		}
	}

	function runOnClick(run) {
		if ($clicked_run != run) $clicked_step = ''; // reset selected step when a different run is clicked
		$clicked_run = run;
		$show_steps_list = true;
		// if simulation widget is clicked again then remove resource usages table
		if ($steps_list != run.steps) {
			$show_usages = false;
		}
		$steps_list = run.steps;
	}
	refresh_active_runs();
	$: data = $clicked_simulation.runs;
</script>

{#if data.length == 0}
	<br />
	<h3>
		<span style="font-size: 30px;">🐧</span> No runs for this simulation, start testing by creating a
		new run!
	</h3>
	<Modal><CreateRunButton /></Modal>
{:else}
	<main class="scrollable_main">
		<h2 class="table_heading_h2">
			Runs &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

			<Modal><CreateRunButton /></Modal>
			<Modal><StartRunButton /></Modal>
			<Modal><StopRunButton /></Modal>
			{#if $clicked_run != '' && $clicked_run.status != 'active' && $clicked_run.status != 'queued'}
				<Modal><DeleteRunButton /></Modal>
			{/if}
		</h2>
		<ul class="scrollable_ul">
			<li class="table-header-runs">
				<div class="col-1">NAME</div>
				<div class="col-2">STATUS</div>
				<div class="col-3">REMARK</div>
			</li>
			{#each data as item, index (item)}
				<li
					class="pointer"
					class:active={item === $clicked_run}
					class:scrollable_li={item != $clicked_run}
					{index}
					on:click={() => runOnClick(item)}
				>
					<div class="col-1">{item.name}</div>
					<div class="col-2">{item.status}</div>
					<div class="col-3">{display_run_msg(item)}</div>
				</li>
			{/each}
			<Scroll threshold={100} />
		</ul>
		<table>
			<tr>
				<td>NAME</td>
				<td>STATUS</td>
				<td>REMARK</td>
				<td >RUN</td>
				<td>STOP</td>
				<td>DELETE</td>
			</tr>
		
				{#each data as item, index (item)}
				<tr
				class:active={item === $clicked_run}
				{index}
				on:click={() => runOnClick(item)}
				>
				    <td>{item.name}</td>
					<td>{item.status}</td>
					<td>{display_run_msg(item)}</td>
					<td>
						{#if item.status == 'waiting'}
							<Modal><StartRunButton /></Modal>
						{/if}
						</td>
					<td>
						{#if item.status == 'waiting'}
							<Modal><StopRunButton /></Modal>
						{/if}
					</td>
					<td>
						{#if $clicked_run != '' && $clicked_run.status != 'active' && $clicked_run.status != 'queued'}
						<Modal><DeleteRunButton /></Modal>
						{/if}
					</td>
				</tr>
				{/each}
			
		</table>
		<Scroll threshold={100} />
	</main>
{/if}

<style>
	.col-1 {
		flex-basis: 25%;
	}
	.col-2 {
		flex-basis: 25%;
	}
	.col-3 {
		flex-basis: 50%;
	}
</style>
