<script lang="ts">
	import { onMount } from 'svelte';
	import { dryRunsList, graphQLClient, clickedProjectId } from '../../../../stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewDryRun from './modal-submit-new-dry-run.svelte';
	import type { DryRun, Project } from '../../../../types.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js'
    import { get } from 'svelte/store';

	// TODO: Aleena extract project id from params
	// export async function load({ params }: { params: { project_id: string } }) {
	// 	let { project_id } = params;
	// }

	let projectName = '';

	// const getDryRunsList = async (): Promise<{ project: Project }> => {
	const getDryRunsList = async (): Promise<DryRun[]> => {
		const variables = {projectId: get(clickedProjectId)};
		const response: { project: Project } = await get(graphQLClient).request(allDryRunsQuery, variables);
		return response.project.dryRuns;
	};
	const dryRunsPromise = getDryRunsList();

    // TODO: move to lib or utils
	dryRunsPromise.then((value) => {
			// projectName = value.project.name;

		    $dryRunsList = value;
			reactiveDryRunsList = value;
            $dryRunsList.forEach((element) => {
			    checkboxes[element.id] = false;
		    });
		}).catch(() => {
		    $dryRunsList = undefined;
		});

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
		$dryRunsList?.forEach((element) => {
			checkboxes[element.id] = false;
		});
	});	

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
	}

	// TODO: fill all possible phase values
	function getDryRunAction(status:string):string {
		// status = status.toString();
		if(status == 'Succeeded')
			return 'rerun';
		else if(status == 'Pending')
			return 'run';
		else if(status == 'Failed' || status == 'Error')
			return 'retry';
		return 'rerun';
	}

	$: reactiveDryRunsList = $dryRunsList;

</script>
<!-- Page Header -->
<div class="flex-row p-5">
	<h1>Projects <span STYLE="font-size:14px">/ </span>{projectName}</h1>
	<div class="flex justify-between">
		<div>
			<p class="text-xs">dry runs: {$dryRunsList?.length}</p>
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
	
	<div class="table-container p-5">
		<!-- TODO: add margin/padding for table elements -->
        {#await dryRunsPromise}
			<p style="font-size:20px;">Loading dry runs...</p>
            {:then $dryRunsList}
			<table class="table table-interactive">
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Result</th>
						<th>Run duration</th>
						<th>Action</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveDryRunsList || [] as run}
						<tr class="table-row-checked">
							<td><input type="checkbox" bind:checked={checkboxes[run.id]} class="checkbox variant-filled" /></td>
							<td>{run.id}</td>
							<td><SymbolForRunResult run_result={(run.status.phase).toString()} /></td>
							<!-- <td>{transformSecondsToHoursMinutesSeconds(run.status.estimatedDuration)}</td> -->
							<!-- TODO: calculate from started and finished -->
							<td>{run.status.estimatedDuration}</td>
							<td>
								<button type="button" class="btn-icon btn-icon-sm variant-soft">
									<SymbolForAction action="{getDryRunAction((run.status.phase).toString())}" />
								</button>
							</td>
							<td>{run.createdAt}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/await}
	</div>
</div>

<Modal />
