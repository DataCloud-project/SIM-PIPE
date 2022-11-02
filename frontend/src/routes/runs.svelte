<script>
	import {
		show_usages,
		steps_list,
		clicked_step,
		show_steps_list,
		clicked_run,
		clicked_simulation
	} from '../stores/stores';
	import dayjs from 'dayjs';

	import { paginate, LightPaginationNav } from 'svelte-paginate';
	import Modal from 'svelte-simple-modal';
	import CreateRunButton from './modals/create_run_button.svelte';
	import StartRunButton from './modals/start_run_button.svelte';
	import StopRunButton from './modals/stop_run_button.svelte';
	import DeleteRunButton from './modals/delete_run_button.svelte';

	$: items = $clicked_simulation.runs;
	let current_page = 1;
	let page_size = 5;
	$clicked_run = '';
	$: paginated_runs = paginate({ items, pageSize: page_size, currentPage: current_page });
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
</script>

<div class="table_container">
	<h2 class="table_heading_h2">Runs
		&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

		<Modal><CreateRunButton /></Modal>
		<Modal><StartRunButton /></Modal>
		<Modal><StopRunButton /></Modal>
		{#if $clicked_run != '' && $clicked_run.status != 'active' && $clicked_run.status != 'queued'}
			<Modal><DeleteRunButton /></Modal>
		{/if}
	</h2>
	<!-- <div> 
		<Modal><CreateRunButton /></Modal>
		<Modal><StartRunButton /></Modal>
		<Modal><StopRunButton /></Modal>
		{#if $clicked_run != '' && $clicked_run.status != 'active' && $clicked_run.status != 'queued'}
			<Modal><DeleteRunButton /></Modal>
		{/if}		 
	</div> -->
	<br />
	<ul class="responsive-table">
		<li class="table-header-runs">
			<div class="col-1">NAME</div>
			<div class="col-2">STATUS</div>
			<div class="col-3">RUN_ID</div>
		</li>
		{#each paginated_runs as run, index (run)}
			<li
				class="pointer"
				class:active={run === $clicked_run}
				{index}
				on:click={() => runOnClick(run)}
			>
				<div class="col-1">
				<!-- {#if run === $clicked_run && run.status != 'active' && run.status != 'queued'}
					<Modal><DeleteRunButton /></Modal>
				{/if}
				{#if run === $clicked_run}
					<Modal><StopRunButton /></Modal>
				{/if} -->
				{run.name}</div>
				<div class="col-2">{run.status}</div>
				<div class="col-3">{display_run_msg(run)}</div>
			</li>
		{/each}
	</ul>

	<LightPaginationNav
		totalItems={items.length}
		pageSize={page_size}
		currentPage={current_page}
		limit={1}
		showStepOptions={true}
		on:setPage={(e) => (current_page = e.detail.page)}
	/>
</div>

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
