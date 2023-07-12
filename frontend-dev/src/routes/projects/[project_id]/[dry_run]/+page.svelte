<script lang="ts">
	import { selectedProject, graphQLClient, clickedProjectId } from '../../../../stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import ModalSubmitNewDryRun from './modal-submit-new-dry-run.svelte';
	import type { DryRun, Project } from '../../../../types.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js'
    import { get } from 'svelte/store';
	import deleteDryRunMutation from '../../../../queries/delete_dry_run.js';

	// TODO: Aleena extract project id from params
	// export async function load({ params }: { params: { project_id: string } }) {
	// 	let { project_id } = params;
	// }


	const getProjectDetails = async (): Promise<Project> => {
		const variables = {projectId: get(clickedProjectId)};
		const response: { project: Project } = await get(graphQLClient).request(allDryRunsQuery, variables);
		return response.project;
	};
	const projectDetailsPromise = getProjectDetails();

    // TODO: move to lib or utils
	projectDetailsPromise.then((value) => {
		    $selectedProject = value;
			reactiveProjectDetails = value;
            reactiveProjectDetails.dryRuns.forEach((element:DryRun) => {
			    checkboxes[element.id] = false;
		    });
		}).catch(() => {
		    reactiveProjectDetails = undefined;
		});
	
	const modal: ModalSettings = {
		type: 'component',
		component: { ref: ModalSubmitNewDryRun	},
		title: 'Add new dry run',
		body: 'Enter details of dry run',
	};
	
	let checkboxes: Record<string, boolean> = {};	

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

	async function onDeleteSelected() {
		Object.keys(checkboxes).filter((item) => checkboxes[item]).forEach(async (element) => {
		    const response = await get(graphQLClient).request(deleteDryRunMutation, { dryRunId: element });
        });
        // reset checkboxes
        $selectedProject?.dryRuns.forEach((element) => {
            checkboxes[element.id] = false;
		});
        // inserting a small delay because sometimes delete mutation returns true, but the deleted dry run is also returned in the query
        await new Promise(resolve => setTimeout(resolve, 100));

        // update the project list after deletion
        let responseProjectDetails: { project: Project } = await get(graphQLClient).request(allDryRunsQuery, { projectId: $clickedProjectId });
        $selectedProject = responseProjectDetails.project;
	}
	
	// TODO: fill all possible phase values
	function getDryRunAction(status:string):string {
		if(status == 'Succeeded')
			return 'rerun';
		else if(status == 'Running')
			return 'stop';
		else if(status == 'Pending')
			return 'run';
		else if(status == 'Failed' || status == 'Error')
			return 'retry';
		return 'rerun';
	}

	$: reactiveProjectDetails = $selectedProject;

</script>
<!-- Page Header -->
<div class="flex-row p-5">
	{#await projectDetailsPromise}
		<h1>Loading all dry runs .... </h1>
	{:then response}
	<h1>Projects 
		<span STYLE="font-size:14px">/ </span>{reactiveProjectDetails?.name}</h1>
	<div class="flex justify-between">
		<div>
			<p class="text-xs">dry runs: {reactiveProjectDetails?.dryRuns.length}</p>
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
					{#each reactiveProjectDetails?.dryRuns || [] as run}
						<tr class="table-row-checked">
							<td><input type="checkbox" bind:checked={checkboxes[run.id]} class="checkbox variant-filled" /></td>
							<td>{run.id}</td>
							<td><SymbolForRunResult run_result={(run.status.phase).toString()} /></td>
							<!-- <td>{transformSecondsToHoursMinutesSeconds(run.status.estimatedDuration)}</td> -->
							<!-- TODO: calculate from started and finished -->
							<td>{run.status.estimatedDuration}</td>
							<td>
								<button type="button" class="btn-icon btn-icon-sm variant-soft">
									<SymbolForAction action="{getDryRunAction((run.status.phase).toString())}" 
									dryRunId={run.id} />
								</button>
							</td>
							<td>{run.createdAt}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
{/await}
</div>

<Modal />
