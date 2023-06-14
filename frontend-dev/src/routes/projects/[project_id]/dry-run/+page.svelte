<script lang="ts">
	import { onMount } from 'svelte';
	import dry_runs from '../../../../stores/dry-runs.json';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';

	let checkboxes: Record<string, boolean> = {};

	// onMount add dry_run.names to checkboxes
	onMount(() => {
		dry_runs.data.forEach((element) => {
			checkboxes[element.name] = false;
		});
	});

	export async function load({ params }: { params: { project_id: string } }) {
		let { project_id } = params;
	}

	function transformSecondsToHoursMinutesSeconds(seconds_string: string) {
		let seconds = Number(seconds_string);
		let hours = Math.floor(seconds / 3600);
		let minutes = Math.floor((seconds - hours * 3600) / 60);
		let secondsLeft = seconds - hours * 3600 - minutes * 60;

		let formattedHours = hours.toString().padStart(2, '0');
		let formattedMinutes = minutes.toString().padStart(2, '0');
		let formattedSeconds = secondsLeft.toString().padStart(2, '0');

		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	}

	function onSelectRow(run_name: string) {
		checkboxes[run_name] = !checkboxes[run_name];
		console.log(checkboxes);
	}

	function onDeleteSelected() {
		let selected_runs = Object.keys(checkboxes).filter((run_name) => checkboxes[run_name]);
		console.log(selected_runs);
	}
</script>

<!-- Page Header -->
<div class="flex-col p-5">
	<h1>Project: {dry_runs.name}</h1>
	<div class="flex justify-between">
		<div>
			<p class="text-xs">id: {dry_runs.project_id}</p>
			<p class="text-xs">dry runs: {dry_runs.dry_run_count}</p>
		</div>
		<div class="flex place-content-end">
			<button type="button" class="btn btn-sm variant-filled" on:click={() => onDeleteSelected()}>
				<span>Delete</span>
			</button>
		</div>
	</div>
	<!-- Responsive Container (recommended) -->
	<div class="table-container pt-5">
		<!-- Native Table Element -->
		<!-- TODO add margin/padding for table elements -->
		<table class="table table-interactive">
			<thead>
				<tr>
					<th />
					<th>Name</th>
					<th>Result</th>
					<th>Run duration</th>
					<th>Action</th>
					<th>Created at</th>
				</tr>
			</thead>
			<tbody>
				{#each dry_runs.data as run}
					<tr class="table-row-checked" on:click={() => onSelectRow(run.name)}>
						<td><input type="checkbox" /></td>
						<td>{run.name}</td>
						<td><SymbolForRunResult run_result={run.run_result} /></td>
						<td>{transformSecondsToHoursMinutesSeconds(run.duration_seconds)}</td>
						<td>
							<button type="button" class="btn-icon btn-icon-sm variant-soft">
								<SymbolForAction action={run.action} />
							</button>
						</td>
						<td>{run.created_at}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>
