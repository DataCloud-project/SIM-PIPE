<script lang="ts">
	import { Modal, modalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import ModalSubmitNewProject from './modal-submit-new-project.svelte';
	import { projectsList, clickedProjectId } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import { goto } from '$app/navigation';
	import Timestamp from './[project_id]/[dry_run]/timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils';

	const getProjectsList = async (): Promise<Project[]> => {
		const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		return response.projects;
	};

	// TODO: replace this when dryRuns_aggregate is ready in the api
	// get dry run counts for each project, and reset checkboxes
	function getDryRunCounts(projectList: Project[] | undefined): Record<string, number> {
		dryRunCounts = {};
		projectList?.forEach((project) => {
			checkboxes[project.id] = false;
			dryRunCounts[project.id] = project.dryRuns.length;
		});
		return dryRunCounts;
	}

	const projectsPromise = getProjectsList();
	let checkboxes: Record<string, boolean> = {};
	let dryRunCounts: Record<string, number> = {};

	// TODO: move to lib or utils
	projectsPromise
		.then((value) => {
			$projectsList = value;
			reactiveProjectsList = value;
			dryRunCounts = getDryRunCounts($projectsList);
		})
		.catch(() => {
			$projectsList = undefined;
		});

	const modal: ModalSettings = {
		type: 'component',
		component: { ref: ModalSubmitNewProject },
		title: 'Add new project',
		body: 'Enter details of project'
	};
	async function onDeleteSelected() {
		Object.keys(checkboxes)
			.filter((item) => checkboxes[item])
			.forEach(async (element) => {
				const variables = {
					projectId: element
				};
				const response = await requestGraphQLClient(deleteProjectMutation, variables);
			});
		const projectDeletedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Project deleted🗑️!',
			body: `Deleted projects: ${Object.keys(checkboxes).filter((item) => checkboxes[item])}`
		};
		modalStore.trigger(projectDeletedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		// reset checkboxes
		$projectsList?.forEach((element) => {
			checkboxes[element.id] = false;
		});
		// inserting a small delay because sometimes delete mutation returns true, but all projects query returns the deleted project as well
		await new Promise((resolve) => setTimeout(resolve, 150));

		// update the project list after deletion
		let responseAllProjects: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		projectsList.set(responseAllProjects.projects);
	}

	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	function gotodryruns(dry_run: string) {
		clickedProjectId.set(dry_run);
		goto(`/projects/[project_id]/${dry_run}`);
	}

	function showTemplate(event: any, project: Project) {
		$clickedProjectId = project.id;
		event.stopPropagation();
		const template = project.workflowTemplates[0].argoWorkflowTemplate?.metadata.name;
		goto(`/templates/${template}`);
	}
	$: reactiveProjectsList = $projectsList;
	$: dryRunCounts = getDryRunCounts(reactiveProjectsList);
</script>

<!-- svelte-ignore missing-declaration -->
<div class="flex-row p-5">
	<h1>Projects</h1>

	<div class="flex justify-end">
		<div class="flex-row justify-content-end">
			<button
				type="button"
				class="btn btn-sm variant-filled"
				on:click={() => modalStore.trigger(modal)}
			>
				<span>Create</span>
			</button>
			<button type="button" class="btn btn-sm variant-filled-warning" on:click={onDeleteSelected}>
				<span>Delete</span>
			</button>
		</div>
	</div>

	<div class="p-5 table-container overflow-y-auto max-h-3/4">
		{#await projectsPromise}
			<p style="font-size:20px;">Loading projects...</p>
			<ProgressBar />
		{:then projectsList}
			<table class="table table-interactive">
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Created</th>
						<th>Dry runs</th>
						<!-- <th>Simulation runs</th> -->
						<th>Template</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveProjectsList || [] as project}
						<tr class="" on:click={() => gotodryruns(project.id)}>
							<td>
								<input
									type="checkbox"
									class="checkbox variant-filled"
									bind:checked={checkboxes[project.id]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td>{project.name}</td>
							<!-- <td>{project.createdAt}</td> -->
							<td><Timestamp timestamp={project.createdAt} /> </td><td
								>{dryRunCounts[project.id]}</td
							>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td on:click={(event) => showTemplate(event, project)}>
								<p class="no-underline hover:underline">show</p>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{/await}
	</div>
</div>

{#if $modalStore[0]}
	<Modal />
{/if}
