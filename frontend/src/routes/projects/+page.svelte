<script lang="ts">
	import { Modal, modalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import ModalSubmitNewProject from './modal-submit-new-project.svelte';
	import { projectsList, clickedProjectId } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import { goto } from '$app/navigation';
	import Timestamp from './dryruns/[dry_run]/timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { AlertTriangleIcon, EditIcon, FileTextIcon } from 'svelte-feather-icons';
	import ModalRenameProject from './modal-rename-project.svelte';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import allDryRunsQuery from '../../queries/get_all_dryruns';
	import deleteDryRunMutation from '../../queries/delete_dry_run.js';
	import deleteWorkflowTemplateMutation from '../../queries/delete_workflow_template.js';
	import { displayAlert } from '../../utils/alerts_utils';

	export let visibleAlert = false;
	export let alertTitle = 'Alert!';
	export let alertMessage = 'Alert!';

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
		try {
			Object.keys(checkboxes)
				.filter((item) => checkboxes[item])
				.forEach(async (element) => {
					const project_variables = {
						projectId: element
					};
					const response_dry_runs = await requestGraphQLClient<{
						project: { dryRuns: Record<string, undefined>[] };
					}>(allDryRunsQuery, project_variables);
					response_dry_runs.project.dryRuns.forEach(async (dry_run: Record<string, undefined>) => {
						await requestGraphQLClient(deleteDryRunMutation, {
							dryRunId: dry_run.id
						});
					});
					await requestGraphQLClient(deleteWorkflowTemplateMutation, {
						name: element
					}).catch((error) => {
						console.log(error);
						visibleAlert = true;
						alertTitle = 'Delete workflow template failed!';
						alertMessage = error.message;
					});
					await requestGraphQLClient(deleteProjectMutation, project_variables);
				});
			const title = 'Project deleted🗑️!';
			const body = `Deleted projects: ${Object.keys(checkboxes).filter(
				(item) => checkboxes[item]
			)}`;
			await displayAlert(title, body);
			// inserting a small delay because sometimes delete mutation returns true, but all projects query returns the deleted project as well
			await new Promise((resolve) => setTimeout(resolve, 150));

			// update the project list after deletion
			let responseAllProjects: { projects: Project[] } = await requestGraphQLClient(
				allProjectsQuery
			);
			projectsList.set(responseAllProjects.projects);
		} catch (error) {
			const title = 'Error deleting project❌!';
			const body = `${(error as Error).message}`;
			await displayAlert(title, body, 4000);
		} finally {
			// reset checkboxes
			$projectsList?.forEach((element) => {
				checkboxes[element.id] = false;
			});
		}
	}

	// to disable onclick propogation for checkbox input
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	function gotodryruns(dry_run: string) {
		clickedProjectId.set(dry_run);
		goto(`/projects/dryruns/${dry_run}`);
	}

	function renameProject(event: any, project: Project) {
		event.stopPropagation();

		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ModalRenameProject },
			title: 'Rename project',
			body: 'Enter the new name',
			valueAttr: { projectId: project.id, projectName: project.name }
		};

		modalStore.trigger(modal);
	}

	function showTemplate(event: any, project: Project) {
		$clickedProjectId = project.id;
		event.stopPropagation();
		try {
			const template = project.workflowTemplates[0].argoWorkflowTemplate;
			const template_name = template?.metadata.name;
			goto(`/templates/${template_name}`);
			throw new Error('Template not found!');
		} catch (error) {
			visibleAlert = true;
			alertTitle = 'Template not found!';
			alertMessage = `Workflow template does not exist for this project: ${clickedProjectId}`;
		}
	}
	$: reactiveProjectsList = $projectsList;
	$: dryRunCounts = getDryRunCounts(reactiveProjectsList);
</script>

<!-- svelte-ignore missing-declaration -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await projectsPromise}
			<p style="font-size:20px;">Loading projects...</p>
			<ProgressBar />
		{:then}
			<h1>Projects</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button
						type="button"
						class="btn btn-sm variant-filled"
						on:click={() => modalStore.trigger(modal)}
					>
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
			</div>
			<table class="table table-interactive">
				<caption hidden>Projects</caption>
				<thead>
					<tr>
						<th />
						<th>Name</th>
						<th>Created</th>
						<th>Dry runs</th>
						<th style="text-align:center">Template</th>
						<th />
					</tr>
				</thead>
				<tbody>
					{#each reactiveProjectsList || [] as project}
						<tr on:click={() => gotodryruns(project.id)}>
							<td style="width:25px;">
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={checkboxes[project.id]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="width:25%">{project.name}</td>
							<td style="width:25%">
								<div><Timestamp timestamp={project.createdAt} /></div>
							</td>
							<td style="width:25%">
								{dryRunCounts[project.id]}
							</td>
							<!-- svelte-ignore a11y-click-events-have-key-events -->
							<td style="width:15%" on:click={(event) => showTemplate(event, project)}>
								<div class="grid grid-rows-2 grid-cols-1 justify-items-center">
									<div><FileTextIcon size="1x" /></div>
									<div>
										<p class="no-underline hover:underline">show</p>
										<div />
									</div>
								</div></td
							>
							<td style="width:10%">
								<button
									type="button"
									title="Rename project"
									class="btn-icon btn-icon-sm variant-soft"
									on:click={() => renameProject(event, project)}
								>
									<EditIcon size="20" />
								</button>
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

{#if visibleAlert}
	<aside class="alert variant-ghost">
		<!-- Icon -->
		<div class="flex w-full justify-between">
			<div><AlertTriangleIcon /></div>
			<div class="alert-actions">
				<button
					type="button"
					class="btn btn-sm variant-filled"
					on:click={() => {
						visibleAlert = false;
					}}>OK</button
				>
			</div>
		</div>
		<!-- Message -->
		<div class="alert-message">
			<h3 class="h3">{alertTitle}</h3>
			<p>{alertMessage}</p>
		</div>
	</aside>
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
