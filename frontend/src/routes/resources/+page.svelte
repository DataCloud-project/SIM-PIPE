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

	let resourcesPromise: Promise<Resource[]> = getResourcesList();

	resourcesPromise
		.then((value) => {
			$resourcesList = value;
			reactiveResourcesList = value;
		})
		.catch(() => {
			$resourcesList = undefined;
		});

	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	async function onCreate1(): Promise<void> {
		try {
			const modal: ModalSettings = {
				type: 'component',
				component: 'createNewResourceModal',
				title: 'Add new resource',
				response: async (data: any) => {
					// Poll backend for status
					const resourceName = data.name;
					let tries = 0;
					let ready = false;

					while (!ready && tries < 30) {
						await new Promise((res) => setTimeout(res, 2000)); // poll every 2s
						tries++;

						const response = await requestGraphQLClient(allResourcesQuery, { cache: false }) as { resources: Resource[] };
						const res = response.resources.find((r: Resource) => r.name === resourceName);

						if (res?.status === 'READY') {
							ready = true;
							break;
						}
					}

					// Refresh list
					const updated = await requestGraphQLClient(allResourcesQuery, { cache: false }) as { resources: Resource[] };
					resourcesList.set(updated.resources);

					modalStore.trigger({
						type: 'alert',
						title: 'VM Node Ready ✅',
						body: 'The VM node is running and reachable!'
					});

					await new Promise((res) => setTimeout(res, 1500));
					modalStore.close();
				}
			};
			modalStore.trigger(modal);
		} catch (error) {
			console.error(error);
		}
	}

	async function onDelete(): Promise<void> {
		try {
			const selected = Object.keys(checkboxes).filter((item) => checkboxes[item]);

			await Promise.all(
				selected.map(async (element) => {
					await requestGraphQLClient(deleteResourceMutation, { resourceId: element });
				})
			);
			const vMNodeDeletedMessageModal: ModalSettings = {
				type: 'alert',
				title: 'VM node deleted🗑️!',
				body: `Deleted VM node: ${selected.join(', ')}`
			};
			modalStore.trigger(vMNodeDeletedMessageModal);

			await new Promise((resolve) => setTimeout(resolve, 1500));
			modalStore.close();
		} catch (error) {
			console.log('Error deleting resources:', error);
		} finally {
			Object.keys(checkboxes).forEach((id) => (checkboxes[id] = false));
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			resourcesList.set(response.resources);
		}
	}
</script>

<div class="flex w-full justify-center p-10">
	<div class="table-container w-full">
		<h1>VM Nodes</h1>
		<div class="flex flex-row justify-end p-5 space-x-1">
			<div>
				<button type="button" class="btn btn-sm variant-filled" on:click={() => onCreate1()}>
					<span>Create</span>
				</button>
			</div>
			<div>
				<button type="button" class="btn btn-sm variant-filled-warning" on:click={() => onDelete()}>
					<span>Shutdown</span>
				</button>
			</div>
		</div>
		{#if reactiveResourcesList?.length}
			<table class="table table-interactive w-full">
				<caption hidden>Resources</caption>
				<thead>
					<tr>
						<th class="w-10" />
						<th class="w-1/5">Name</th>
						<th class="w-1/5">OS</th>
						<th class="w-1/5">CPUs</th>
						<th class="w-1/5">Memory (in mb)</th>
						<th class="w-1/5">Status</th>
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
							<td style="w-1/5">{resource.name}</td>
							<td class="w-1/5">{resource.os}</td>
							<td class="w-1/5">{resource.cpus}</td>
							<td class="w-1/5">{resource.memory}</td>
							<td class="w-1/5">{resource.status}</td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>No resources yet.</p>
		{/if}
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
