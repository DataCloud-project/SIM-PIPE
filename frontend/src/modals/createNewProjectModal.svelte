<script lang="ts">
	import { cBase, cHeader, cForm } from '../styles/styles.js';
	import { projectsList, username } from '../stores/stores.js';
	import createProjectMutation from '../queries/create_project.js';
	import allProjectsQuery from '../queries/get_all_projects.js';
	import createWorkflowTemplateMutation from '../queries/create_workflow_template.js';
	import type { Project } from '../types.js';
	//import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton'; -- old v1 skeletonlabs
	import yaml from 'js-yaml';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

    // Props - Exposes parent props to this component
    export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	
	let project_name: string = '';
	let input_file: FileList;
	$: template_name = project_name.replace(/\s+/g, '-').toLowerCase();

	async function createProject(project_name: string): Promise<{status: number, project: {name: string, id: string}}> {
		const variablesCreateProjectRequest = {
			project: { name: project_name }
		};
		return requestGraphQLClient<{createProject: {name: string, id: string}}>(
			createProjectMutation,
			variablesCreateProjectRequest
		).then(data => {
			return { status: 200, project: { name: data.createProject.name, id: data.createProject.id } };
		}).catch(error => {
			console.log(`createProject error: ${error}`);
			return { status: 500, project: { name: 'none', id: 'none' } };
		});
	}

	async function createWorkflowTemplate(project_id: string, workflow_template: string): Promise<{status: number, name: string}> {
		const variablesCreateWorkflowTemplateRequest = {
				input: {
					argoWorkflowTemplate: workflow_template,
					name: template_name,
					projectId: project_id
				}
			};
		return requestGraphQLClient<{createWorkflowTemplate: {name: string}}>(
			createWorkflowTemplateMutation,
			variablesCreateWorkflowTemplateRequest
		).then(data => {
			console.log("createWorkflowTemplate response:")
			console.log(data)
			return {status: 200, name: data.createWorkflowTemplate.name}
		}).catch(error => {
			console.log(`createWorkflowTemplate error: ${error}`);
			return {status: 500, name: 'none'}
		});
	}

	async function handleInputFile(file: FileList): Promise<string> {
		const file_text = await file[0].text();
		if (file_text != '') {
			let template: JSON;
			try {
				template = JSON.parse(file_text);
			} catch {
				template = yaml.load(file_text) as JSON;
			}
		}
		return file_text;
	}

	async function onSubmit() {
		const workflow_template = await handleInputFile(input_file);
		createProject(project_name).then(createProjectResponse => {
			if (createProjectResponse.status == 200 && createProjectResponse.project.id != 'none') {
				console.log("Successfully created project")
				createWorkflowTemplate(createProjectResponse.project.id, workflow_template).then(createWorkflowTemplateResponse => {
					if (createWorkflowTemplateResponse.status == 200) {
						console.log(`Successfully created workflow template ${createWorkflowTemplateResponse.name}`)
					} else {
						Error(`Workflow template creation failed ${createWorkflowTemplateResponse}`);
					}
					$modalStore[0].response({createProjectResponse: createProjectResponse, createWorkflowResponse: createWorkflowTemplateResponse});
					modalStore.close();
				});
			} else {
				Error(`Project creation failed ${createProjectResponse}`);
			}
		}).catch(error => {
			console.log(error);
			Error(`Project creation failed ${error}`);
		});
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
						bind:value={project_name}
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
					<input class="input" type="file" bind:files={input_file} />
				</span>
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