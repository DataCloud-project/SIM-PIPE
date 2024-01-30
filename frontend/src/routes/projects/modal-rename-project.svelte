<script lang="ts">
	import { cBase, cHeader, cForm } from '../../styles/styles.js';
	import { projectsList } from '../../stores/stores.js';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import type { Project } from '../../types.js';
	//import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton'; -- old v1 skeletonlabs 
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import renameProjectMutation from '../../queries/rename_project.js';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	export let parent: any;
	const project: { projectId: string; projectName: string } = $modalStore[0]?.valueAttr as {
		projectId: string;
		projectName: string;
	};
	const formData = {
		name: ''
	};
	let hideModal = false;
	let alertModal = false;

	async function onRenameProjectSubmit(): Promise<void> {
		hideModal = true;
		const variables1 = {
			projectId: project.projectId,
			name: formData.name
		};
		modalStore.close();

		await requestGraphQLClient(renameProjectMutation, variables1);
		const projectRenamedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Project renamed &#10024;!',
			body: `New name: ${formData.name}`
		};
		alertModal = true;
		modalStore.trigger(projectRenamedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		modalStore.clear();

		// update the project list after addition
		const responseAllProjects: { projects: Project[] } = await requestGraphQLClient(
			allProjectsQuery
		);
		$projectsList = [];
		$projectsList = responseAllProjects.projects;
	}
</script>

{#if !hideModal}
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
