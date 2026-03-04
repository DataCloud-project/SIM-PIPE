<script lang="ts">
	import { getModalStore, ProgressBar } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { resourcesList } from '../../stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import allResourcesQuery from '../../queries/get_all_resources.js';
	import type { Resource } from '../../types.js';
	import Alert from '$lib/modules/alert.svelte';
	import deleteResourceMutation from '$queries/delete_resource.js';
	import shutdownResourceMutation from '$queries/shutdown_resource.js';

	const modalStore = getModalStore();

	let visibleAlert: boolean = false;
	let alertTitle: string = 'Alert!';
	let alertMessage: string = 'Alert!';
	let alertVariant: string = 'variant-ghost-surface';

	$: reactiveResourcesList = $resourcesList;
	let loadingError: string | null;

	const checkboxes: Record<string, boolean> = {};

	function resetCheckboxes(list?: Resource[]): void {
		Object.keys(checkboxes).forEach((key) => delete checkboxes[key]);
		list?.forEach((resource) => {
			checkboxes[resource.name] = false;
		});
	}

	// fetch resources
	const getResourcesList = async (): Promise<Resource[]> => {
		try {
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			return response.resources;
		} catch (error) {
			console.error('Error fetching resources:', error);
			loadingError = 'Failed to load resources';
			return [];
		}
	};

	async function refreshResources(): Promise<Resource[]> {
		const value = await getResourcesList();
		$resourcesList = value;
		reactiveResourcesList = value;
		resetCheckboxes(value);
		return value;
	}

	const resourcesPromise: Promise<Resource[]> = refreshResources();

	const handleCheckboxClick = (event: any) => {
		event.stopPropagation();
	};

	async function onCreate1(): Promise<void> {
		try {
			const modal: ModalSettings = {
				type: 'component',
				component: 'createNewResourceModal',
				title: 'Add new resource',
				response: (data: any) => {
					// Poll backend for status
					const resourceName = data.name;
					let tries = 0;
					let ready = false;

					// eslint-disable-next-line no-void
					void (async () => {
						while (!ready && tries < 30) {
							await new Promise((res) => {
								setTimeout(res, 2000);
							}); // poll every 2s
							tries += 1;

							// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
							const response = (await requestGraphQLClient(allResourcesQuery, {
								cache: false
							})) as { resources: Resource[] };
							const res = response.resources.find((r: Resource) => r.name === resourceName);

							if (res?.status === 'READY') {
								ready = true;
								break;
							}
						}

						// Refresh list
						// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
						const updated = (await requestGraphQLClient(allResourcesQuery, { cache: false })) as {
							resources: Resource[];
						};
						resourcesList.set(updated.resources);

						modalStore.trigger({
							type: 'alert',
							title: 'VM Node Ready ✅',
							body: 'The VM node is running and reachable!'
						});

						await new Promise((res) => {
							setTimeout(res, 1500);
						});
						modalStore.close();
					})();
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

			await new Promise((resolve) => {
				setTimeout(resolve, 1500);
			});
			modalStore.close();
		} catch (error) {
			console.log('Error deleting resources:', error);
		} finally {
			// eslint-disable-next-line no-return-assign
			Object.keys(checkboxes).forEach((id) => (checkboxes[id] = false));
			await refreshResources();
		}
	}

	async function onShutdown(): Promise<void> {
		try {
			const selected = Object.keys(checkboxes).filter((item) => checkboxes[item]);

			await Promise.all(
				selected.map(async (element) => {
					await requestGraphQLClient(shutdownResourceMutation, { resourceId: element });
				})
			);
			const vMNodeShutdownMessageModal: ModalSettings = {
				type: 'alert',
				title: 'VM node has been shutdown!',
				body: `Shutdown VM node: ${selected.join(', ')}`
			};
			modalStore.trigger(vMNodeShutdownMessageModal);

			await new Promise((resolve) => {
				setTimeout(resolve, 1500);
			});
			modalStore.close();
		} catch (error) {
			console.log('Error shutting down VM node:', error);
		} finally {
			// eslint-disable-next-line no-return-assign
			Object.keys(checkboxes).forEach((id) => (checkboxes[id] = false));
			await refreshResources();
		}
	}

	async function onOpenLogs(name: string): Promise<void> {
		console.log('To be implemented');
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
				<button
					type="button"
					class="btn btn-sm variant-filled-surface"
					on:click={() => onShutdown()}
				>
					<span>Shutdown</span>
				</button>
			</div>
			<div>
				<button type="button" class="btn btn-sm variant-filled-warning" on:click={() => onDelete()}>
					<span>Delete</span>
				</button>
			</div>
		</div>
		{#await resourcesPromise}
			<p style="font-size:20px;">Loading VM nodes...</p>
			<ProgressBar />
		{:then}
			{#if loadingError}
				<div class="card p-4">
					<h2>Failed to load resources</h2>
					<p>{loadingError}</p>
				</div>
			{:else if reactiveResourcesList?.length}
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
							<th class="w-1/5">Logs</th>
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
								<td style="w-1/5">{resource.os}</td>
								<td style="w-1/6">{resource.cpus}</td>
								<td style="w-1/5">{resource.memory}</td>
								<td style="w-1/5">{resource.status}</td>
								<td style="w-1/4">
									<button
										type="button"
										class="btn btn-sm variant-filled"
										on:click={() => onOpenLogs(resource.name)}
									>
										Get VM console logs
									</button>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			{:else}
				<p>No resources yet.</p>
			{/if}
		{:catch error}
			<div class="card p-4">
				<h2>Failed to load resources</h2>
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
