<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	import allProjectsQuery from '$queries/get_all_projects.js';
	import renameProjectMutation from '$queries/rename_project.js';
	import { projectsList } from '$stores/stores.js';
	import { cBase, cForm, cHeader } from '$styles/styles.js';
	// import { displayAlert } from '$utils/alerts-utils.js';
	import type { AllProjectsResponse } from '$typesdefinitions';

	// Props - Exposes parent props to this component
	const modalStore = getModalStore();

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	const project: { projectId: string; projectName: string } = $modalStore[0]?.valueAttr as {
		projectId: string;
		projectName: string;
	};
	const formData = {
		name: ''
	};
	let alertModal = false;

	async function onRenameProjectSubmit(): Promise<void> {
		const variables = {
			projectId: project.projectId,
			name: formData.name
		};
		modalStore.close();
		try {
			await requestGraphQLClient(renameProjectMutation, variables);

			const title = 'Project renamed &#10024;!';
			const body = `New name: ${formData.name}`;
			// await displayAlert(title, body);
			console.log(title, body);
			alertModal = true;

			// update the project list after addition
			const responseAllProjects: AllProjectsResponse = await requestGraphQLClient(allProjectsQuery);
			$projectsList = responseAllProjects.projects;
		} catch (error) {
			const title = 'Error renaming project❌!';
			const body = (error as Error).message;
			// await displayAlert(title, body);
			console.log(title, body);
			alertModal = true;
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Project name</span>
				<input class="input" type="text" readonly value={project.projectName} />
			</label>
			<label class="label">
				<span>New name</span>
				<input
					class="input"
					type="text"
					bind:value={formData.name}
					placeholder="Enter new name..."
				/>
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onRenameProjectSubmit}>Submit</button>
		</footer>
	</div>
{/if}
