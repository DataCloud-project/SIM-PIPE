<script lang="ts">
	import {cBase, cHeader, cForm} from '../../styles/styles.js';
	import { graphQLClient } from '../../stores/stores.js';
	import createProjectMutation from '../../queries/create_project.js';
	import { get } from 'svelte/store';

	export let parent: any;

	// Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// TODO: Add all required user inputs (id (? create automatically) and argo workflow template)
	const formData = {
		name: '',		
	};

	async function onCreateProjectSubmit(): Promise<void>{
		const variables = {
			project: {name: formData.name}
		};
		const response = await get(graphQLClient).request(createProjectMutation, variables);
		modalStore.close();
	}

</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Project name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<!-- TODO: Fill the rest -->
		</form>
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onCreateProjectSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  