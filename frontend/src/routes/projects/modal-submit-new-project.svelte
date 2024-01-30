<script lang="ts">
	import { cBase, cHeader, cForm } from '../../styles/styles.js';
	import { projectsList, username } from '../../stores/stores.js';
	import createProjectMutation from '../../queries/create_project.js';
	import allProjectsQuery from '../../queries/get_all_projects.js';
	import createWorkflowTemplateMutation from '../../queries/create_workflow_template.js';
	import type { AllProjectsResponse, Project } from '../../types.js';
	import { modalStore, Modal } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { displayAlert } from '../../utils/alerts_utils.js';
	import { validateYAML } from '../../utils/argo_utils.js';

	export let parent: any;

	const formData = {
		project_name: '',
		template_name: '',
		files: undefined
	};
	let alertModal = false;

	// function to transform project_name to template_name
	$: formData.template_name = formData.project_name.replace(/\s+/g, '-').toLowerCase();

	async function onCreateProjectSubmit(): Promise<void> {
		modalStore.close();

		let name = formData.project_name;
		let currentUsername;
		// Subscribe and release immediately…
		username.subscribe(($value) => {
			currentUsername = $value;
		})();
		if (username && currentUsername) {
			name = `${name}-${currentUsername}`;
		}

		const files = formData.files as unknown as FileList;
		const template_text = await files?.[0]?.text();

		try {
			if (!template_text) throw new Error('No workflow description found!');
			// TODO: add argo workflow template checking later when backend api is extended
			if (!validateYAML(template_text).valid) {
				throw new Error(`Error parsing argo workflow template input
				<br><br>
				Description: ${validateYAML(template_text).message as string}`);
			}
			const responseCreateProject: { createProject: Project } = await requestGraphQLClient(
				createProjectMutation,
				{
					project: { name }
				}
			);
			const title = 'New project created&#10024;!';
			const body = `New project ID: ${responseCreateProject?.createProject?.id}`;
			await displayAlert(title, body);
			alertModal = true;

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
			const responseAllProjects: AllProjectsResponse = await requestGraphQLClient(allProjectsQuery);
			$projectsList = responseAllProjects.projects;
		} catch (error) {
			const title = 'Error creating project❌!';
			const body = (error as Error).message;
			await displayAlert(title, body, 10000);
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
