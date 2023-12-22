<script lang="ts">
	import { getModalStore, Modal, type ModalSettings } from '@skeletonlabs/skeleton';

	import { cBase, cForm, cHeader } from '../../styles/styles.js';
	import type { SimPipeModal } from '../../types.js';

	export let parent: SimPipeModal;

	const formData = {
		name: '',
		files: [] as unknown as FileList
	};
	let hideModal = false;
	let alertModal = false;

	const modalStore = getModalStore();

	async function onCreateProjectSubmit(): Promise<void> {
		modalStore.close();
		hideModal = true;
		// TODO: create file query
		// const variables1 = {
		// };

		// const responseCreateProject: { createProject: Project } = await requestGraphQLClient(
		// 	createProjectMutation,
		// 	variables1
		// );
		const projectCreatedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'New Sample File created &#10024;!',
			body: `New file ID: 123`
		};
		alertModal = true;
		modalStore.trigger(projectCreatedMessageModal);
		await new Promise((resolve) => {
			setTimeout(resolve, 1500);
		});
		modalStore.close();
		modalStore.clear();

		modalStore.close();
		// TODO: update the filesList after addition
		// const responseAllProjects: { projects: Project[] } = await requestGraphQLClient(
		// 	allProjectsQuery
		// );
		// $filesList = [];
		// $filesList = responseAllProjects.projects;
	}
</script>

<!-- {#if $modalStore[0]} -->
{#if !hideModal}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>File name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				Upload File
				<br />
				<input class="input" multiple type="file" bind:files={formData.files} />
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onCreateProjectSubmit}>Submit</button>
		</footer>
	</div>
{/if}

{#if alertModal}
	<Modal />
{/if}
