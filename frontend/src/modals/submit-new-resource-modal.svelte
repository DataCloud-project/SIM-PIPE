<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	import { cBase, cForm, cHeader } from '$styles/styles.js';
	import createResourceMutation from '$queries/create_resource.js';
	import refreshVMNodesDetails from '$lib/refresh_vmnodes.js';
	import { resourcesList } from '$stores/stores.js';
	import type { Resource } from '$typesdefinitions';
	import allResourcesQuery from '$queries/get_all_resources.js';

	export let parent: SvelteComponent;
	export let response: (result: any) => void;

	const modalStore = getModalStore();

	// Bindings for the inputs
	const formData = {
		name: 'vm-',
		os: 'ubuntu-20',
		cpus: 1,
		memory: 1024
	};

	const osOptions = [
		{ value: 'ubuntu-18', label: 'Ubuntu 18.04' },
		{ value: 'ubuntu-20', label: 'Ubuntu 20.04' },
		{ value: 'ubuntu-22', label: 'Ubuntu 22.04' },
		{ value: 'ubuntu-24', label: 'Ubuntu 24.04' }
	];

	async function onSubmit(): Promise<void> {
		const createResourceMutationVariables = {
			input: {
				name: formData.name,
				os: formData.os,
				cpus: formData.cpus.toString(),
				memory: formData.memory.toString()
			}
		};

		try {
			requestGraphQLClient(
				createResourceMutation,
				createResourceMutationVariables
			);

			modalStore.close();

			const createResourceMessageModal: ModalSettings = {
				type: 'alert',
				title: 'New node is being provisioned &#10024;!',
				body: 'New node is being added to the cluster and will be ready to emulate on in a few minutes!'
			};
			modalStore.trigger(createResourceMessageModal);

			await new Promise((resolve) => setTimeout(resolve, 1500));

			modalStore.close();
			modalStore.clear();

			await refreshVMNodesDetails(formData.name);
			const response: { resources: Resource[] } = await requestGraphQLClient(allResourcesQuery);
			resourcesList.set(response.resources);
			const createResourceReadyModal: ModalSettings = {
				type: 'alert',
				title: 'New node is ready!',
				body: 'New node is ready!'
			};
			modalStore.trigger(createResourceReadyModal);
			await new Promise((resolve) => setTimeout(resolve, 2000));

			modalStore.close();
			modalStore.clear();

		} catch (error) {
			console.error('❌ Error in onSubmit →', error);
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>VM name</span>
				<div class="flex">
					<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
				</div>
			</label>
			<label class="label">
				<span>OS</span>
				<div class="flex">
					<select class="input" bind:value={formData.os}>
						<option value="" disabled hidden>Select an OS (e.g., {osOptions[0].label})</option>
						{#each osOptions as option}
							<option value={option.value}>{option.label}</option>
						{/each}
					</select>
				</div>
			</label>
			<label class="label">
				<span>Number of CPUs</span>
				<div class="flex">
					<input
						class="input"
						type="number"
						bind:value={formData.cpus}
						min="1"
						step="1"
						placeholder="Enter CPUs..."
					/>
				</div>
			</label>
			<label class="label">
				<span>Memory (MB)</span>
				<div class="flex">
					<input
						class="input"
						type="number"
						bind:value={formData.memory}
						min="512"
						step="256"
						placeholder="Enter memory..."
					/>
				</div>
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onSubmit}>Submit</button>
		</footer>
	</div>
{/if}
