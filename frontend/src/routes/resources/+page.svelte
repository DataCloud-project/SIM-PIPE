<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { EditIcon, FileTextIcon } from 'svelte-feather-icons';
	import { resourcesList } from '../../stores/stores.js';
	import type { Project } from '../../types.js';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import deleteProjectMutation from '../../queries/delete_project.js';
	import allDryRunsQuery from '../../queries/get_all_dryruns.js';
	import allResourcesQuery from '../../queries/get_all_resources.js';
	import type { Resource } from '../../types.js';
	import deleteDryRunMutation from '../../queries/delete_dry_run.js';
	import deleteWorkflowTemplateMutation from '../../queries/delete_workflow_template.js';
	// import { displayAlert } from '../../utils/alerts-utils.js';
	import Alert from '$lib/modules/alert.svelte';

	const modalStore = getModalStore();

	let visibleAlert: boolean = false;
	let alertTitle: string = 'Alert!';
	let alertMessage: string = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

	$: reactiveResourcesList = $resourcesList;

	const checkboxes: Record<string, boolean> = {};

	const getResourcesList = async (): Promise<Resource[]> => {
		const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
		console.log(response);
		return response.resources;
	};

	const resourcesPromise = getResourcesList();

	resourcesPromise
		.then((value) => {
			$resourcesList = value;
			reactiveResourcesList = value;
		})
		// eslint-disable-next-line unicorn/prefer-top-level-await
		.catch(() => {
			$resourcesList = undefined;
		});

	// to disable onclick propogation for checkbox input
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	async function handleOnCreateResourceResponse(createResourceResponse: {
		status: number;
		resource: { name: string; id: string };
		error: string;
	}): Promise<boolean> {
		visibleAlert = true;
		let hasErrors = false;
		if (createResourceResponse.status === 200) {
			await requestGraphQLClient<{ resources: Resource[] }>(allResourcesQuery).then((response) => {
				reactiveResourcesList = response.resources;
				$resourcesList = response.resources;
			});
		} else {
			hasErrors = true;
			alertVariant = 'variant-filled-error';
			alertTitle = 'Resource creation failed!';
			alertMessage = `Resource creation failed with status ${createResourceResponse.status}: ${createResourceResponse.error}`;
		}
		return hasErrors;
	}

	async function onCreate(): Promise<void> {
		const modalPromise = new Promise<boolean>((resolve) => {
			const modal: ModalSettings = {
				type: 'component',
				component: 'createNewResourceModal',
				title: 'Add new resource',
				body: 'Enter details of resource',
				response: (r: {
					createResourceResponse: {
						status: number;
						error: string;
						resource: { name: string; id: string };
					};
				}) => {
					resolve(handleOnCreateResourceResponse(r.createResourceResponse));
				}
			};
			modalStore.trigger(modal);
		}).then(() => {
			console.log('onCreateNewProject promise resolved');
		});
		modalPromise.catch((error) => {
			console.log('onCreateNewProject promise error:', error);
		});
		// update the resources list after creation
		const responseAllResources: { resources: Resource[] } =
			await requestGraphQLClient(allResourcesQuery);
		resourcesList.set(responseAllResources.resources);
	}

	async function onShutdown(): Promise<void> {
		const variables = {
			resourceId: 'linux-node'
		};
		const deleteResourceMutation = `mutation deleteResource($resourceId: String!) {
			deleteResource(resourceId: $resourceId)
		}`;
		await requestGraphQLClient(deleteResourceMutation, variables).catch((error) => {
			console.log(error);
			visibleAlert = true;
			alertTitle = 'Deleting resource failed!';
			alertMessage = error.message;
		});
		visibleAlert = true;
		alertTitle = 'Resource deleted!';
		alertMessage = 'Resource deleted successfully';
		// update the resources list after deletion
		const responseAllResources: { resources: Resource[] } =
			await requestGraphQLClient(allResourcesQuery);
		resourcesList.set(responseAllResources.resources);
	}
</script>

<!-- svelte-ignore missing-declaration -->
<div class="flex w-full justify-center p-10">
	<div class="table-container w-full">
		{#await resourcesPromise}
			<p style="font-size:20px;">Loading resources...</p>
			<ProgressBar />
		{:then}
			<h1>Resources</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={() => onCreate()}>
						<span>Create</span>
					</button>
				</div>
				<div>
					<button type="button" class="btn btn-sm variant-filled-warning" on:click={onShutdown}>
						<span>Shutdown</span>
					</button>
				</div>
			</div>
			<table class="table table-interactive w-full">
				<caption hidden>Resources</caption>
				<thead>
					<tr>
						<th class="w-10" />
						<!-- Checkbox column, fixed small width -->
						<th class="w-1/4">Name</th>
						<!-- Equal width for content columns -->
						<th class="w-1/4">OS</th>
						<th class="w-1/4">CPUs</th>
						<th class="w-1/4">Memory (in mb)</th>
					</tr>
				</thead>
				<tbody>
					{#each reactiveResourcesList || [] as resource}
						<tr>
							<td class="w-10">
								<input
									type="checkbox"
									class="checkbox"
									bind:checked={checkboxes[resource.id]}
									on:click={(event) => handleCheckboxClick(event)}
								/>
							</td>
							<td style="w-1/4">{resource.name}</td>
							<td class="w-1/4">{resource.os}</td>
							<td class="w-1/4">{resource.cpus}</td>
							<td class="w-1/4">{resource.memory}</td>
						</tr>
					{/each}
				</tbody>
			</table>
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
