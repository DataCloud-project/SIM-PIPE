<script lang="ts">
	import { onMount } from 'svelte';
	import { dry_runs } from '../../../../stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewDryRun from './modal-submit-new-dry-run.svelte';

	const modalSubmitNewDryRun: ModalComponent = {
		ref: ModalSubmitNewDryRun,
	};

	const modal: ModalSettings = {
		type: 'component',
		component: modalSubmitNewDryRun,
		title: 'Add new dry run',
		body: 'Enter details of dry run',
	};
	
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

	// TODO: replace with actual api call; just a temporary delete function to mimic deletion
	function onDeleteSelected() {
		let selected_runs = Object.keys(checkboxes).filter((run_name) => checkboxes[run_name]);
		dry_runs["data"] = dry_runs["data"].filter(item => !(selected_runs.includes(item.name)));
	}

</script>
<!-- Page Header -->
<div class="flex-row p-5">
	<h1>Projecs <span STYLE="font-size:14px">/ </span>{dry_runs.name}</h1>
	<div class="flex justify-between">
		<div>
			<p class="text-xs">dry runs: {dry_runs.dry_run_count}</p>
		</div>
		<div class="flex-row justify-content-end">	
			<button type="button" class="btn btn-sm variant-filled" on:click={() => (modalStore.trigger(modal))}>
				<span>Create</span>
			</button>			
			<button type="button" class="btn btn-sm variant-filled-warning" on:click={onDeleteSelected}>
				<span>Delete</span>
			</button>
		</div>		
	</div>
	
	<!-- Responsive Container (recommended) -->
	<div class="table-container p-5">
		<!-- Native Table Element -->
		<!-- TODO: add margin/padding for table elements -->
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
					<tr class="table-row-checked">
						<td><input type="checkbox" bind:checked={checkboxes[run.name]} class="checkbox variant-filled" /></td>
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

<Modal />
