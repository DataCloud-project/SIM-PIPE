<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	import createProjectMutation from '$queries/create_project.js';
	import createWorkflowTemplateMutation from '$queries/create_workflow_template.js';
	import { cBase, cForm, cHeader } from '$styles/styles.js';
	import createResourceMutation from '$queries/create_resource.js';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	// Bindings for the inputs
	let name = 'linux-node';	// Default value
	let os = 'ubuntu-20'; // Default value
	let cpus = 2;        // Default value
	let memory = 4096;   // Default value in MB

	// OS options for the dropdown todo: move out?
	const osOptions = [
    { value: 'ubuntu-18', label: 'Ubuntu 18.04' },
    { value: 'ubuntu-20', label: 'Ubuntu 20.04' },
    { value: 'ubuntu-22', label: 'Ubuntu 22.04' },
    { value: 'ubuntu-24', label: 'Ubuntu 24.04' },
 	 ];

	async function onSubmit(): Promise<void> {	
		// close the modal
		modalStore.close();

		// Create the resource		
		const createResourceMutationVariables = {
			input: {
				name: name,
				os: os,
				cpus: cpus.toString(),
				memory: memory.toString()
			}
		};
		try {
			const result = await requestGraphQLClient(
				createResourceMutation,
				createResourceMutationVariables
			);
			console.log('time:', new Date().toISOString());
			console.log('result:', result);
			
			const createResourceMessageModal: ModalSettings = {
				type: 'alert',
				title: 'New resource created&#10024;!',
				body: 'New node has been added to the cluster and ready to emulate on!'
			};
			modalStore.trigger(createResourceMessageModal);

			await new Promise((resolve) => setTimeout(resolve, 1500));
			// modalStore.close();
			// modalStore.clear();
		} catch (error) {
			console.error('Error creating resource:', error);
		}
	}
</script>

<!-- The modal form to submit a new project -->
{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Resource name</span>
				<div class="flex">
					<input class="input" type="text" bind:value={name} placeholder="Enter name..." />
				</div>
			</label>
			<label class="label">
				<span>OS</span>
				<div class="flex">
				  <select class="input" bind:value={os}>
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
				  <input class="input" type="number" bind:value={cpus} min="1" step="1" placeholder="Enter CPUs..." />
				</div>
			  </label>
			  <label class="label">
				<span>Memory (MB)</span>
				<div class="flex">
				  <input class="input" type="number" bind:value={memory} min="512" step="256" placeholder="Enter memory..." />
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
