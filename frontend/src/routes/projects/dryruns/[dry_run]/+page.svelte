<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { selectedProject, clickedProjectId } from '../../../../stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import ModalSubmitNewDryRun from './modal-submit-new-dry-run.svelte';
	import type { DryRun, DryRunMetrics, Project } from '../../../../types.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import deleteDryRunMutation from '../../../../queries/delete_dry_run.js';
	import { goto } from '$app/navigation';
	import Timestamp from './timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { calculateDuration } from '../../../../utils/resource_utils.js';

	export let data;

	export const getProjectDetails = async (): Promise<Project> => {
		const variables = { projectId: data.dry_run };
		const response: { project: Project } = await requestGraphQLClient(allDryRunsQuery, variables);
		return response.project;
	};
	const projectDetailsPromise = getProjectDetails();

	// TODO: move to lib or utils
	projectDetailsPromise
		.then((value) => {
			$selectedProject = value;
			reactiveProjectDetails = value;
			reactiveProjectDetails.dryRuns.forEach((element: DryRun) => {
				checkboxes[element.id] = false;
			});
		})
		.catch(() => {
			reactiveProjectDetails = undefined;
		});

	let checkboxes: Record<string, boolean> = {};

	async function onDeleteSelected() {
		Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.forEach(async (element) => {
				const response = await requestGraphQLClient(deleteDryRunMutation, { dryRunId: element });
			});
		const dryRunDeletedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Dry run deleted🗑️!',
			body: `Deleted dry runs: ${Object.keys(checkboxes).filter((item) => checkboxes[item])}`
		};
		modalStore.trigger(dryRunDeletedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		// reset checkboxes
		$selectedProject?.dryRuns.forEach((element) => {
			checkboxes[element.id] = false;
		});
		// inserting a small delay because sometimes delete mutation returns true, but the deleted dry run is also returned in the query
		await new Promise((resolve) => setTimeout(resolve, 100));

		// update the project list after deletion
		let responseProjectDetails: { project: Project } = await requestGraphQLClient(allDryRunsQuery, {
			projectId: $clickedProjectId
		});
		$selectedProject = responseProjectDetails.project;
	}
	async function onPredictSelected() {
		// TODO: later change to passing dry runs ids through some other means (not to have too long url)
		const dryRunIsToCompared = Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.join(' ');
		goto(`/projects/analytics/${dryRunIsToCompared}`);
	}
	async function onCreateSelected() {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ModalSubmitNewDryRun },
			title: 'Add new dry run',
			body: 'Enter details of dry run'
		};
		modalStore.trigger(modal);
	}

	function getDryRunAction(status: string): string {
		if (status == 'Succeeded') return 'rerun';
		else if (status == 'Running') return 'stop';
		else if (status == 'Pending' || status == 'Skipped' || status == 'Omitted') return 'run';
		else if (status == 'Failed' || status == 'Error') return 'alert';
		return 'unknown';
	}

	function dryRunOnClick(dryRunId: string) {
		const resource = dryRunId;
		goto(`/projects/dryruns/${dryRunId}/${resource}`);
	}

	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};
	$: reactiveProjectDetails = $selectedProject;
</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await projectDetailsPromise}
			<p style="font-size:20px;">Loading all dry runs ....</p>
			<ProgressBar />
		{:then response}
			<h1>
				<a href="/projects">Projects</a>
				<span STYLE="font-size:14px">/ </span>
				<button on:click={() => goto(`/projects/${reactiveProjectDetails?.id}`)}
					>{reactiveProjectDetails?.name}
				</button>
			</h1>
			<div class="flex justify-between">
				<div>
					<p class="text-xs">dry runs: {reactiveProjectDetails?.dryRuns.length}</p>
				</div>
				<div class="flex flex-row justify-end p-5 space-x-1">
					<div>
						<button type="button" class="btn btn-sm variant-filled" on:click={onCreateSelected}>
							<span>Create</span>
						</button>
					</div>
					<div>
						<button
							type="button"
							class="btn btn-sm variant-filled-warning"
							on:click={onDeleteSelected}
						>
							<span>Delete</span>
						</button>
					</div>
					{#if Object.values(checkboxes).some((value) => value)}
						<div>
							<button
								type="button"
								class="btn btn-sm variant-filled-primary"
								on:click={onPredictSelected}
							>
								<span>Predict</span>
							</button>
						</div>
					{/if}
				</div>
			</div>
			{#if reactiveProjectDetails?.dryRuns?.length || 0 > 0}
				<table class="table table-interactive">
					<caption hidden>Dry runs</caption>
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
							<tr on:click={() => dryRunOnClick(run.id)}>
								<td style="width:25px">
									<input
										type="checkbox"
										bind:checked={checkboxes[run.id]}
										class="checkbox"
										on:click={(event) => handleCheckboxClick(event)}
									/>
								</td>
								<td style="width:20%">{run.id}</td>
								<td style="width:20%">
									<div><SymbolForRunResult run_result={run.status.phase.toString()} /></div>
								</td>
								<td style="width:20%">
									<div>
										{calculateDuration(run.nodes)}
									</div>
								</td>
								<td style="width:20%">
									<button type="button" class="btn-icon btn-icon-sm variant-soft">
										<SymbolForAction
											action={getDryRunAction(run.status.phase.toString())}
											dryRunId={run.id}
										/>
									</button>
								</td>
								<td style="width:20%"><Timestamp timestamp={run.createdAt} /> </td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/await}
	</div>
</div>

{#if $modalStore[0]}
	<Modal />
{/if}

<style>
	.table.table {
		max-height: 80vh;
		overflow-y: auto;
		overflow-x: scroll;
		display: block;
		border-collapse: collapse;
		margin-left: auto;
		margin-right: auto;
		table-layout: auto;
		width: 100%;
	}
	thead {
		position: sticky;
		top: 0;
	}
</style>
