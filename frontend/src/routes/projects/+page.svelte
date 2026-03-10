<script lang="ts">
	let showDetails = false;
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { EditIcon, FileTextIcon } from 'svelte-feather-icons';
	import { projectsList, clickedProjectId } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import { goto } from '$app/navigation';
	import Timestamp from './dryruns/[dry_run]/timestamp.svelte';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import allDryRunsQuery from '../../queries/get_all_dryruns.js';
	import deleteDryRunMutation from '../../queries/delete_dry_run.js';
	import deleteWorkflowTemplateMutation from '../../queries/delete_workflow_template.js';
	import Alert from '$lib/modules/alert.svelte';
	import { displayModal } from '$utils/modal-utils.js';

	const modalStore = getModalStore();

	let visibleAlert: boolean = false;
	let alertTitle: string = 'Alert!';
	let alertMessage: string = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

	$: reactiveProjectsList = $projectsList;
	let loadingError: string | null;

	const checkboxes: Record<string, boolean> = {};
	let dryRunCounts: Record<string, number> = {};

	function shortErrorMessage(error: string): string {
		if (!error) return 'Unknown error';
		const firstLine = error.split('\n')[0]?.trim();
		return firstLine && firstLine.length > 0 ? firstLine : error;
	}

	const getProjectsList = async (): Promise<Project[]> => {
		try {
			const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
			return response.projects;
		} catch (error) {
			loadingError = 'Failed to load projects';
			throw error;
		}
	};

	// get dry run counts for each project, and reset checkboxes
	function getDryRunCounts(projectList: Project[] | undefined): Record<string, number> {
		dryRunCounts = {};
		projectList?.forEach((project) => {
			checkboxes[project.id] = false;
			dryRunCounts[project.id] = project.dryRuns.length;
		});
		return dryRunCounts;
	}

	$: dryRunCounts = getDryRunCounts(reactiveProjectsList);

	async function refreshProjects(): Promise<Project[]> {
		const value = await getProjectsList();
		$projectsList = value;
		reactiveProjectsList = value;
		dryRunCounts = getDryRunCounts(value);
		return value;
	}

	const projectsPromise = refreshProjects();

	/* const modal: ModalSettings = {
		type: 'component',
		component: 'submitNewProjectModal',
		title: 'Add new project',
		body: 'Enter details of project'
	}; */

	async function onDeleteSelected(): Promise<void> {
		try {
			const selectedProjectIds = Object.keys(checkboxes).filter((item) => checkboxes[item]);
			const deletePromises = selectedProjectIds.map(async (element) => {
				const projectVariables = { projectId: element };
				const responseDryRuns = await requestGraphQLClient<{
					project: { dryRuns: Record<string, undefined>[] };
				}>(allDryRunsQuery, projectVariables);
				await Promise.all(
					responseDryRuns.project.dryRuns.map(async (dry_run: Record<string, undefined>) => {
						try {
							await requestGraphQLClient(deleteDryRunMutation, { dryRunId: dry_run.id });
						} catch (error) {
							const message = error instanceof Error ? error.message : String(error);
							await displayModal('Error deleting dry run⚠️', `Error: ${message}`, modalStore);
						}
					})
				);
				await requestGraphQLClient(deleteWorkflowTemplateMutation, { name: element }).catch(
					(error) => {
						// eslint-disable-next-line @typescript-eslint/no-floating-promises
						displayModal(
							'Delete workflow template failed⚠️',
							`Error: ${error instanceof Error ? error.message : String(error)}`,
							modalStore
						);
					}
				);
				await requestGraphQLClient(deleteProjectMutation, projectVariables);
			});

			await Promise.all(deletePromises);

			await displayModal(
				'Project deleted🗑️!',
				`Deleted projects: ${selectedProjectIds.join(', ')}`,
				modalStore
			);
			// update the project list after deletion
			await refreshProjects();
		} catch (error) {
			const title = 'Error deleting project❌!';
			const body = `${(error as Error).message}`;
			await displayModal(title, body, modalStore);
		} finally {
			// reset checkboxes
			$projectsList?.forEach((element) => {
				checkboxes[element.id] = false;
			});
		}
	}

	// to disable onclick propogation for checkbox input
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	function gotodryruns(dry_run: string): void {
		clickedProjectId.set(dry_run);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/projects/dryruns/${dry_run}`);
	}

	async function handleOnCreateProjectResponse(
		createProjectResponse: { status: number; project: { name: string; id: string }; error: string },
		createWorkflowResponse: { status: number; name: string; error: string }
	): Promise<boolean> {
		console.log('createProjectResponse:', createProjectResponse);
		console.log('createWorkflowResponse:', createWorkflowResponse);
		visibleAlert = false;
		let hasErrors = false;
		if (createProjectResponse.status === 200) {
			await requestGraphQLClient<{ projects: Project[] }>(allProjectsQuery).then((response) => {
				reactiveProjectsList = response.projects;
				$projectsList = response.projects;
			});
			if (createWorkflowResponse.status === 200) {
				visibleAlert = true;
				alertVariant = 'variant-ghost-success';
				alertTitle = 'Project created!🎉';
				alertMessage = `Project ${createProjectResponse.project.name} and workflow template ${createWorkflowResponse.name} created`;
			} else {
				hasErrors = true;
			}
		} else {
			hasErrors = true;
		}

		if (hasErrors) {
			const errorModal: ModalSettings = {
				type: 'alert',
				title: 'Project not created',
				body: `Project was not created because workflow template creation failed: ${shortErrorMessage(createWorkflowResponse.error || createProjectResponse.error)}`
			};
			modalStore.trigger(errorModal);
		}

		return hasErrors;
	}

	function onCreateNewProject(): void {
		console.log('onCreateNewProject');
		const modalPromise = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: 'createNewProjectModal',
				title: 'Add new project',
				body: 'Enter details of project',
				response: (r: {
					createProjectResponse: {
						status: number;
						error: string;
						project: { name: string; id: string };
					};
					createWorkflowResponse: { status: number; error: string; name: string };
				}) => {
					resolve(handleOnCreateProjectResponse(r.createProjectResponse, r.createWorkflowResponse));
				}
			};
			modalStore.trigger(modal);
		}).then(async () => {
			await refreshProjects();
		});
		modalPromise.catch((error) => {
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			displayModal('Error creating project', 'Error creating project', modalStore);
		});
	}

	function renameProject(project: Project): void {
		const modal: ModalSettings = {
			type: 'component',
			component: 'renameProjectModal',
			title: 'Rename project',
			body: 'Enter the new name',
			valueAttr: { projectId: project.id, projectName: project.name }
		};

		modalStore.trigger(modal);
	}

	function gotoTemplate(project: Project): void {
		$clickedProjectId = project.id;
		const template = project.workflowTemplates[0].argoWorkflowTemplate;
		const templateName = template?.metadata.name;
		const url = `/templates/${templateName}`;
		console.log(`Navigating to: ${url}`);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(url);
	}
</script>

<!-- svelte-ignore missing-declaration -->
<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await projectsPromise}
			<p style="font-size:20px;">Loading projects...</p>
			<ProgressBar />
		{:then}
			{#if loadingError}
				<div class="error-message">
					<strong>Failed to load projects</strong>
					<button
						on:click={() => {
							showDetails = !showDetails;
						}}
						style="margin-left: 1em;"
					>
						{showDetails ? 'Hide Details' : 'Show Details'}
					</button>
					{#if showDetails}
						<pre
							style="max-height: 300px; overflow: auto; background: #f8f8f8; border: 1px solid #ccc; padding: 1em; margin-top: 1em;">
							{loadingError}
						</pre>
					{/if}
				</div>
			{:else}
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
							on:click={() => onDeleteSelected()}
						>
							<span>Delete</span>
						</button>
					</div>
				</div>
				{#if reactiveProjectsList && reactiveProjectsList.length > 0}
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
								<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
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
									<!-- eslint-disable-next-line svelte/no-unused-svelte-ignore -->
									<!-- svelte-ignore a11y-click-events-have-key-events -->
									<!-- eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-function-return-type -->
									<td style="width:15%" on:click|stopPropagation={(event) => gotoTemplate(project)}>
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
				{:else}
					<p>No projects yet.</p>
				{/if}
			{/if}
		{:catch error}
			<div class="card p-4">
				<h2>Failed to load projects</h2>
				<p>{error.message}</p>
			</div>
		{/await}
	</div>
</div>

<Alert bind:visibleAlert bind:alertTitle bind:alertMessage bind:alertVariant />

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
