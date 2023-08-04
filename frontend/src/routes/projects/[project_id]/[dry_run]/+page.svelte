<script lang="ts">
	import { selectedProject, clickedProjectId } from '../../../../stores/stores.js';
	import SymbolForRunResult from './symbol-for-run-result.svelte';
	import SymbolForAction from './symbol-for-action.svelte';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import ModalSubmitNewDryRun from './modal-submit-new-dry-run.svelte';
	import type { DryRun, Project } from '../../../../types.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import deleteDryRunMutation from '../../../../queries/delete_dry_run.js';
	import { goto } from '$app/navigation';
	import Timestamp from './timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	export let data;

	const getProjectDetails = async (): Promise<Project> => {
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
		Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.forEach(async (element) => {
				const response = await requestGraphQLClient(deleteDryRunMutation, { dryRunId: element });
			});
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
	async function onCreateSelected() {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ModalSubmitNewDryRun },
			title: 'Add new dry run',
			body: 'Enter details of dry run'
		};
		modalStore.trigger(modal);
	}

	// TODO: fill all possible phase values
	function getDryRunAction(status: string): string {
		if (status == 'Succeeded') return 'rerun';
		else if (status == 'Running') return 'stop';
		else if (status == 'Pending' || status == 'Skipped' || status == 'Omitted') return 'run';
		else if (status == 'Failed' || status == 'Error') return 'alert';
		return 'unknown';
	}

	function dryRunOnClick(dryRunId: string) {
		const resource = dryRunId;
		goto(`/projects/[project_id]/${dryRunId}/${resource}`);
	}

		// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	$: reactiveProjectDetails = $selectedProject;
</script>

<!-- Page Header -->
<div class="flex-row p-5">
	{#await projectDetailsPromise}
		<h1>Loading all dry runs ....</h1>
	{:then response}
		<h1>
			<a href="/projects">Projects</a>
			<span STYLE="font-size:14px">/ </span>
			<button on:click={() => goto(`/projects/[project_id]/${reactiveProjectDetails?.id}`)}
				>{reactiveProjectDetails?.name}
			</button>
		</h1>
		<div class="flex justify-between">
			<div>
				<p class="text-xs">dry runs: {reactiveProjectDetails?.dryRuns.length}</p>
			</div>
			<div class="flex-row justify-content-end">
				<button type="button" class="btn btn-sm variant-filled" on:click={onCreateSelected}>
					<span>Create</span>
				</button>
				<button type="button" class="btn btn-sm variant-filled-warning" on:click={onDeleteSelected}>
					<span>Delete</span>
				</button>
			</div>
		</div>

		<div class="table-container p-5">
			<table class="table table-interactive">
				<caption hidden>Dry runs</caption>
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th><div class="flex justify-center"><div>Result</div></div></th>
						<th>Run duration</th>
						<th>Action</th>
						<th>Created</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveProjectDetails?.dryRuns || [] as run}
						<tr on:click={() => dryRunOnClick(run.id)}>
							<td style="width:10px">
								<input
									type="checkbox"
									bind:checked={checkboxes[run.id]}
									class="checkbox"
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="width:80%">{run.id}</td>
							<td style="width:100%">
								<div class="flex justify-center">
									<div><SymbolForRunResult run_result={run.status.phase.toString()} /></div>
								</div>
							</td>
							<!-- TODO: calculate from started and finished -->
							<td style="width:100%">
								<div class="flex justify-end">
									<div>{run.status.estimatedDuration}</div>
								</div>
							</td>
							<td style="width:100%">
								<div class="flex justify-center">
									<div>
										<button type="button" class="btn-icon btn-icon-sm variant-soft">
											<SymbolForAction
												action={getDryRunAction(run.status.phase.toString())}
												dryRunId={run.id}
											/>
										</button>
									</div>
								</div>
							</td>
							<!-- <td>{run.createdAt}</td> -->
							<td style="width:20%"><Timestamp timestamp={run.createdAt} /> </td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	{/await}
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
		width: 90%;
	}
	thead {
		position: sticky;
		top: 0;
	}
  </style>