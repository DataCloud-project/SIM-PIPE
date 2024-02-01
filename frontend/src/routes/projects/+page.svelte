<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { projectsList, clickedProjectId } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import { goto } from '$app/navigation';
	import Timestamp from './project_id/[dry_run]/timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { AlertTriangleIcon, EditIcon, FileTextIcon } from 'svelte-feather-icons';
	import ModalRenameProject from '../../modals/renameProjectModal.svelte';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import allDryRunsQuery from '../../queries/get_all_dryruns';
	import deleteDryRunMutation from '../../queries/delete_dry_run.js';
	import deleteWorkflowTemplateMutation from '../../queries/delete_workflow_template.js';

	const modalStore = getModalStore();

	let visibleAlert = false;
	let alertTitle = 'Alert!';
	let alertMessage = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

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

	async function onDeleteSelected() {
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
					const response_delete_dry_run = await requestGraphQLClient(deleteDryRunMutation, {
						dryRunId: dry_run.id
					});
				});
				const delete_workflow_template = await requestGraphQLClient(
					deleteWorkflowTemplateMutation,
					{
						name: element
					}
				).catch((error) => {
					console.log(error);
					visibleAlert = true;
					alertTitle = 'Delete workflow template failed!';
					alertMessage = error.message;
					alertVariant = 'variant-filled-error';
				});
				const delete_project_response = await requestGraphQLClient(
					deleteProjectMutation,
					project_variables
				);
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
		goto(`/projects/project_id/${dry_run}`);
	}

	function onCreateNewProject() {
		const modal: ModalSettings = {
			type: 'component',
			component: 'createNewProjectModal',
			title: 'Add new project',
			body: 'Enter details of project',
			response: (r: {
				createProjectResponse: { status: number, project: {name: string, id: string}}, 
				createWorkflowResponse: { status: number, name: string } 
			}) => {
				handleOnCreateProjectResponse(r.createProjectResponse, r.createWorkflowResponse);
			}
		};
		modalStore.trigger(modal);
	}

	async function handleOnCreateProjectResponse(
		createProjectResponse: { status: number, project: {name: string, id: string}}, 
		createWorkflowResponse: { status: number, name: string }
	) {
		console.log(createProjectResponse, createWorkflowResponse);
		visibleAlert = true;
		if (createProjectResponse.status === 200 && createWorkflowResponse.status === 200) {
			await requestGraphQLClient<{projects: Project[]}>(allProjectsQuery).then((response) => {
				reactiveProjectsList = $projectsList = response.projects;
			})
			alertVariant = 'variant-ghost-success';
			alertTitle = 'Project created!';
			alertMessage = `Project ${createProjectResponse.project.name} created with id ${createProjectResponse.project.id}`;
	} else if (createProjectResponse.status === 200 && createWorkflowResponse.status !== 200) {
			alertVariant = 'variant-ghost-warning';
			alertTitle = 'Project created, but workflow creation failed!';
			alertMessage = `Try to create template manually`;
	} else {
			alertVariant = 'variant-filled-error';
			alertTitle = 'Project creation failed!';
			alertMessage = `Project creation failed with status ${createProjectResponse.status} and workflow template creation failed with status ${createWorkflowResponse.status}`;
	}
		
	}
	

	function renameProject(project: Project) {
		const modal: ModalSettings = {
			type: 'component',
			component: { ref: ModalRenameProject },
			title: 'Rename project',
			body: 'Enter the new name',
			valueAttr: { projectId: project.id, projectName: project.name }
		};

		modalStore.trigger(modal);
	}

	function gotoTemplate(project: Project) {
		$clickedProjectId = project.id;
		console.log("showTemplate", project.id, $clickedProjectId)
		try {
			const template = project.workflowTemplates[0].argoWorkflowTemplate;
			const template_name = template?.metadata.name;
			console.log(template_name)
			goto(`/templates/${template_name}`); // TODO: redirecting to template page does not work. why?
		} catch (error) {
			visibleAlert = true;
			alertTitle = 'Template not found!';
			alertMessage = `Workflow template does not exist for this project: ${clickedProjectId}`;
			alertVariant = 'variant-ghost-warning';
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
		{:then projectsList}
			<h1>Projects</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button
						type="button"
						class="btn btn-sm variant-filled"
						on:click={() => onCreateNewProject()}
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
							<td style="width:15%" on:click={() => gotoTemplate(project)}>
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
									on:click={() => renameProject(project)}
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


{#if visibleAlert}
	<aside class="alert {alertVariant}">
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
