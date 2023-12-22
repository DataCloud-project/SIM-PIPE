<script lang="ts">
	import { getModalStore, Modal, type ModalSettings } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';

	import { requestGraphQLClient } from '$lib/graphql-utils.js';

	import createProjectMutation from '../../queries/create-project.js';
	import createWorkflowTemplateMutation from '../../queries/create-workflow-template.js';
	import allProjectsQuery from '../../queries/get-all-projects.js';
	import { projectsList, username } from '../../stores/stores.js';
	import { cBase, cForm, cHeader } from '../../styles/styles.js';
	import type { Project, SimPipeModal } from '../../types.js';

	export let parent: SimPipeModal;
	const modalStore = getModalStore();

	const formData = {
		project_name: '',
		template_name: '',
		files: undefined
	};
	let hideModal = false;
	let alertModal = false;

	// function to transform project_name to template_name
	$: formData.template_name = formData.project_name.replaceAll(/\s+/g, '-').toLowerCase();

	export async function onCreateProjectSubmit(): Promise<void> {
		modalStore.close();
		hideModal = true;

		let name = formData.project_name;
		let currentUsername;
		// Subscribe and release immediately…
		username.subscribe(($value) => {
			currentUsername = $value;
		})();
		if (username && currentUsername) {
			name = `${name}-${currentUsername}`;
		}

		const variables1 = {
			project: { name }
		};

		const responseCreateProject: { createProject: Project } = await requestGraphQLClient(
			createProjectMutation,
			variables1
		);
		const projectCreatedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'New project created&#10024;!',
			body: `New project ID: ${responseCreateProject?.createProject?.id}`
		};
		alertModal = true;
		modalStore.trigger(projectCreatedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		modalStore.clear();
		const files = formData.files as unknown as FileList;
		const template_text = await files?.[0]?.text();
		if (template_text != '') {
			let template: JSON;
			// check if template is in JSON/YAML format, if YAML convert to JSON
			try {
				template = JSON.parse(template_text);
			} catch {
				template = yaml.load(template_text) as JSON;
			}
			const variables2 = {
				input: {
					argoWorkflowTemplate: template,
					name: formData.template_name,
					projectId: responseCreateProject.createProject.id
				}
			};
			await requestGraphQLClient(createWorkflowTemplateMutation, variables2);
		}
		// update the project list after addition
		const responseAllProjects: { projects: Project[] } =
			await requestGraphQLClient(allProjectsQuery);
		$projectsList = [];
		$projectsList = responseAllProjects.projects;
	}
</script>

<!-- {#if $modalStore[0]} -->
{#if !hideModal && $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Project name</span>
				<div class="flex">
					<input
						class="input"
						type="text"
						bind:value={formData.project_name}
						placeholder="Enter name..."
					/>
					{#if $username}
						<div class="whitespace-nowrap flex items-center pl-2">
							<code>-{$username}</code>
						</div>
					{/if}
				</div>
			</label>
			<label class="label">
				Upload project template
				<span>
					<input class="input" type="file" bind:files={formData.files} />
				</span>
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
