<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { EditIcon, FileTextIcon } from 'svelte-feather-icons';
	import { projectsList, clickedProjectId } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import allDryRunsQuery from '../../queries/get_all_dryruns.js';
	import deleteDryRunMutation from '../../queries/delete_dry_run.js';
	import deleteWorkflowTemplateMutation from '../../queries/delete_workflow_template.js';
	// import { displayAlert } from '../../utils/alerts-utils.js';
	import Alert from '$lib/modules/alert.svelte';

	const modalStore = getModalStore();

	let visibleAlert: boolean = false;
	let alertTitle: string = 'Alert!';
	let alertMessage: string = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

	$: reactiveProjectsList = $projectsList;

	const checkboxes: Record<string, boolean> = {};
	let dryRunCounts: Record<string, number> = {};


	// const projectsPromise = getProjectsList();

	// // TODO: move to lib or utils
	// projectsPromise
	// 	.then((value) => {
	// 		$projectsList = value;
	// 		reactiveProjectsList = value;
	// 		dryRunCounts = getDryRunCounts($projectsList);
	// 	})
	// 	// eslint-disable-next-line unicorn/prefer-top-level-await
	// 	.catch(() => {
	// 		$projectsList = undefined;
	// 	});


	// to disable onclick propogation for checkbox input
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};


	async function handleOnCreateProjectResponse(
		createProjectResponse: { status: number; project: { name: string; id: string }; error: string },
		createWorkflowResponse: { status: number; name: string; error: string }
	): Promise<boolean> {
		console.log('createProjectResponse:', createProjectResponse);
		console.log('createWorkflowResponse:', createWorkflowResponse);
		visibleAlert = true;
		let hasErrors = false;
		if (createProjectResponse.status === 200) {
			await requestGraphQLClient<{ projects: Project[] }>(allProjectsQuery).then((response) => {
				reactiveProjectsList = response.projects;
				$projectsList = response.projects;
			});
			if (createWorkflowResponse.status === 200) {
				alertVariant = 'variant-ghost-success';
				alertTitle = 'Project created!';
				alertMessage = `Project ${createProjectResponse.project.name} created with id ${createProjectResponse.project.id} and workflow template ${createWorkflowResponse.name} created`;
			} else {
				hasErrors = true;
				alertVariant = 'variant-ghost-warning';
				alertTitle = 'Project created! However, workflow creation failed!';
				alertMessage = `Create template manually: ${createWorkflowResponse.error}`;
			}
		} else {
			hasErrors = true;
			alertVariant = 'variant-filled-error';
			alertTitle = 'Project creation failed!';
			alertMessage = `Project creation failed with status ${createProjectResponse.status}: ${createProjectResponse.error} and workflow template creation failed with status ${createWorkflowResponse.status}: ${createWorkflowResponse.error}`;
		}
		return hasErrors;
	}

	function onCreateNewProject(): void {
		const modalPromise = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: 'createNewResourceModal',
				title: 'Add new resource',
				body: 'Enter details of resource',
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
		}).then(() => {
			console.log('onCreateNewProject promise resolved');
		});
		modalPromise.catch((error) => {
			console.log('onCreateNewProject promise error:', error);
		});
	}

</script>

<!-- svelte-ignore missing-declaration -->
<div class="flex w-full justify-center p-10">
	<div class="table-container w-full">
	  <h1>Resources</h1>
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
			>
			<!-- on:click={onDeleteSelected} -->
			<span>Delete</span>
		  </button>
		</div>
	  </div>
	  <table class="table table-interactive w-full">
		<caption hidden>Resources</caption>
		<thead>
		  <tr>
			<th class="w-10" /> <!-- Checkbox column, fixed small width -->
			<th class="w-1/3">Name</th> <!-- Equal width for content columns -->
			<th class="w-1/3">Created</th>
			<th class="w-1/3">Status</th>
		  </tr>
		</thead>
		<tbody>
		  <tr>
			<td class="w-10">
			  <input type="checkbox" />
			</td>
			<td class="w-1/3">Ubuntu20</td>
			<td class="w-1/3">2 hours ago</td>
			<td class="w-1/3">Shutdown</td>
		  </tr>
		</tbody>
	  </table>
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
