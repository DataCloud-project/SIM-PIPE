<script lang="ts">
	import {cBase, cHeader, cForm} from '../../styles/styles.js';
	import { projectsList } from '../../stores/stores.js';
	import createProjectMutation from '../../queries/create_project.js';
	import allProjectsQuery from '../../queries/get_all_projects.js'
	import createWorkflowTemplateMutation from '../../queries/create_workflow_template.js'
	import type { Project } from '../../types.js';
	import { modalStore, type ModalSettings, Modal } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	export let parent: any;

	const formData = {
		name: '',
		template: '',		
	};
	let hideModal = false;
	let alertModal = false;

	async function onCreateProjectSubmit(): Promise<void>{
		modalStore.close();
		hideModal = true;
		const variables1 = {
			project: {name: formData.name},
		};

		const responseCreateProject : {createProject: Project} = await requestGraphQLClient(createProjectMutation, variables1);
		const projectCreatedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'New project created&#10024;!',
			body: `New project ID: ${responseCreateProject?.createProject?.id}`,
		};
		alertModal = true;
		modalStore.trigger(projectCreatedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 1500));
		modalStore.close();
		modalStore.clear();
		if (formData.template != '') {
			let template:JSON ;
			// check if template is in JSON/YAML format, if YAML convert to JSON
			try { 
				template = JSON.parse(formData.template);
			} catch {
				template  = yaml.load(formData.template) as JSON;
			}
			const variables2 = {
				input: {
					argoWorkflowTemplate: template,
					name: formData.name,
					projectId: responseCreateProject.createProject.id,
				}
			};
			await requestGraphQLClient(createWorkflowTemplateMutation, variables2);
		}
		// modalStore.close();
        // update the project list after addition
		const responseAllProjects: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		$projectsList = [];
		$projectsList = responseAllProjects.projects;		
	}

</script>

<!-- {#if $modalStore[0]} -->
{#if !hideModal}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Project name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<label class="label">
				Project template
				<br/>
				<textarea class="textarea" rows="8" cols="50" bind:value={formData.template} placeholder="Enter argo workflow template (JSON/YAML)..." ></textarea>
			</label>
		</form>
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onCreateProjectSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  
{#if alertModal}
	<Modal/>
{/if}