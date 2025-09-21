<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { resourcesList } from '../../stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import allResourcesQuery from '../../queries/get_all_resources.js';
	import type { Resource } from '../../types.js';
	import Alert from '$lib/modules/alert.svelte';
	import deleteResourceMutation from '$queries/delete_resource.js';

	const modalStore = getModalStore();

	let visibleAlert: boolean = false;
	let alertTitle: string = 'Alert!';
	let alertMessage: string = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

	$: reactiveResourcesList = $resourcesList;

	const checkboxes: Record<string, boolean> = {};

	// fetch resources
	const getResourcesList = async (): Promise<Resource[]> => {
		try {
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			return response.resources;
		} catch (error) {
			console.error('Error fetching resources:', error);
			return [];
		}
	};

	// initial load
	let resourcesPromise: Promise<Resource[]> = getResourcesList();

	resourcesPromise
		.then((value) => {
			$resourcesList = value;
			reactiveResourcesList = value;
		})
		.catch(() => {
			$resourcesList = undefined;
		});

	// disable onclick propogation for checkbox input
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
			// Wait for the GraphQL request to finish before resetting
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);

			reactiveResourcesList = response.resources;
			resourcesList.set(response.resources);
			$resourcesList = response.resources;

			console.log('Resources after create ✅', reactiveResourcesList);
		} else {
			hasErrors = true;
			alertVariant = 'variant-filled-error';
			alertTitle = 'Resource creation failed!';
			alertMessage = `Resource creation failed with status ${createResourceResponse.status}: ${createResourceResponse.error}`;
		}

		return hasErrors;
	}

	async function onCreate(): Promise<void> {
		try {
			await new Promise<void>((resolve, reject) => {
				const modal: ModalSettings = {
					type: 'component',
					component: 'createNewResourceModal',
					title: 'Add new resource',
					body: 'Enter details of resource',
					response: async (r: {
						createResourceResponse: {
							status: number;
							error: string;
							resource: { name: string; id: string };
						};
					}) => {
						try {
							await handleOnCreateResourceResponse(r.createResourceResponse);
							resolve();
						} catch (err) {
							reject(err);
						}
					}
				};
				modalStore.trigger(modal);
			});

			console.log('✅ onCreate finished, resource list refreshed');
		} catch (error) {
			console.error('❌ onCreate error:', error);
		}
	}

	async function onDelete(): Promise<void> {
		try {
			const selected = Object.keys(checkboxes).filter((item) => checkboxes[item]);

			await Promise.all(
				selected.map(async (element) => {
					console.log('calling deleteResourceMutation');
					await requestGraphQLClient(deleteResourceMutation, { resourceId: element });

					console.log('calling vMNodeDeletedMessageModal');
					const vMNodeDeletedMessageModal: ModalSettings = {
						type: 'alert',
						title: 'VM node deleted🗑️!',
						body: `Deleted VM node: ${element}`
					};
					modalStore.trigger(vMNodeDeletedMessageModal);

					await new Promise((resolve) => setTimeout(resolve, 500));
					modalStore.close();
				})
			);
		} catch (error) {
			console.log('Error deleting resources:', error);
		} finally {
			Object.keys(checkboxes).forEach((id) => (checkboxes[id] = false));

			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			resourcesList.set(response.resources);
			$resourcesList = response.resources;
			console.log('resetting resource list ✅', response.resources);
		}
	}
</script>

<!-- UI -->
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
					<button
						type="button"
						class="btn btn-sm variant-filled-warning"
						on:click={() => onDelete()}
					>
						<span>Shutdown</span>
					</button>
				</div>
			</div>
			<table class="table table-interactive w-full">
				<caption hidden>Resources</caption>
				<thead>
					<tr>
						<th class="w-10" />
						<th class="w-1/4">Name</th>
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
									bind:checked={checkboxes[resource.name]}
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
