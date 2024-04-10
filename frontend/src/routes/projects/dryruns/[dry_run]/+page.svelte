<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { FileTextIcon } from 'svelte-feather-icons';
	import { selectedProject, clickedProjectId } from '$stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import type { DryRun, Project } from '$typesdefinitions';
	import allDryRunsQuery from '$queries/get_all_dryruns.js';
	import deleteDryRunMutation from '$queries/delete_dry_run.js';
	import { goto } from '$app/navigation';
	import Timestamp from './timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { calculateDuration } from '$utils/resource-utils.js';

	const modalStore = getModalStore();

	export let data;

	const checkboxes: Record<string, boolean> = {};

	$: reactiveProjectDetails = $selectedProject;

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

	async function onDeleteSelected(): Promise<void> {
		const deletePromises = Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.map((element) => requestGraphQLClient(deleteDryRunMutation, { dryRunId: element }));

		await Promise.all(deletePromises);

		const dryRunDeletedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Dry run deleted🗑️!',
			body: `Deleted dry runs: ${Object.keys(checkboxes).join(', ')}`
		};
		modalStore.trigger(dryRunDeletedMessageModal);
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		// reset checkboxes
		$selectedProject?.dryRuns.forEach((element) => {
			checkboxes[element.id] = false;
		});
		// inserting a small delay because sometimes delete mutation returns true, but the deleted dry run is also returned in the query
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 100));

		// update the project list after deletion
		const responseProjectDetails: { project: Project } = await requestGraphQLClient(
			allDryRunsQuery,
			{
				projectId: $clickedProjectId
			}
		);
		$selectedProject = responseProjectDetails.project;
	}

	async function onPredictSelected(): Promise<void> {
		// TODO: later change to passing dry runs ids through some other means (not to have too long url)
		const dryRunIsToCompared = Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.join(' ');
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/projects/analytics/${dryRunIsToCompared}`);
	}

	async function onCreateSelected(): Promise<void> {
		const modal: ModalSettings = {
			type: 'component',
			component: 'submitNewDryRunModal',
			title: 'Add new dry run',
			body: 'Enter details of dry run'
		};
		modalStore.trigger(modal);
	}

	function getDryRunAction(status: string): string {
		switch (status) {
			case 'Succeeded': {
				return 'rerun';
			}
			case 'Running': {
				return 'stop';
			}
			case 'Pending': {
				return 'run';
			}
			case 'Skipped': {
				return 'run';
			}
			case 'Omitted': {
				return 'run';
			}
			case 'Failed': {
				return 'alert';
			}
			case 'Error': {
				return 'alert';
			}
			default: {
				return 'run';
			}
		}
	}

	function dryRunOnClick(dryRunId: string): void {
		const resource = dryRunId;
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/projects/dryruns/${dryRunId}/${resource}`);
	}

	function gotoTemplate(dryRunId: string): void {
		const url = `/templates/${dryRunId}`;
		console.log(`Navigating to: ${url}`);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(url);
	}

	// to disable onclick propogation for checkbox input
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};
</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await projectDetailsPromise}
			<p style="font-size:20px;">Loading all dry runs ....</p>
			<ProgressBar />
			<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
		{:then response}
			<h1>
				<a href="/projects">Projects</a>
				<span STYLE="font-size:14px">/ </span>
				<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
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
					{#if Object.values(checkboxes).some(Boolean)}
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
			{#if reactiveProjectDetails?.dryRuns?.length}
				<table class="table table-interactive">
					<caption hidden>Dry runs</caption>
					<thead>
						<tr>
							<th />
							<th>Name</th>
							<th>Result</th>
							<th>Run duration</th>
							<th>Action</th>
							<th style="text-align:center">Template</th>
							<th>Created</th>
						</tr>
					</thead>
					<tbody>
						{#each reactiveProjectDetails?.dryRuns || [] as run}
							<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
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
									<div><SymbolForRunResult runResult={run.status.phase.toString()} /></div>
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
								<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore runResult
								<!-- svelte-ignore a11y-click-events-have-key-events -->
								<td style="width:15%" on:click|stopPropagation={(event) => gotoTemplate(run.id)}>
									<div class="grid grid-rows-2 grid-cols-1 justify-items-center">
										<div><FileTextIcon size="1x" /></div>
										<div>
											<p class="no-underline hover:underline">show</p>
											<div />
										</div>
									</div></td
								>
								<td style="width:20%"><Timestamp timestamp={run.createdAt} /> </td>
							</tr>
						{/each}
					</tbody>
				</table>
			{/if}
		{/await}
	</div>
</div>

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
