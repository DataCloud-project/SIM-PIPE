<script lang="ts">
	import {cBase, cHeader, cForm} from '../../styles/styles.js';
	import { graphQLClient, projectsList } from '../../stores/stores.js';
	import createProjectMutation from '../../queries/create_project.js';
	import { get } from 'svelte/store';
	import allProjectsQuery from '../../queries/get_all_projects.js'
	import createWorkflowTemplateMutation from '../../queries/create_workflow_template.js'
	import type { Project } from '../../types.js';
	import { modalStore } from '@skeletonlabs/skeleton';

	export let parent: any;

	const formData = {
		name: '',
		template: '',		
	};

	async function onCreateProjectSubmit(): Promise<void>{
		const variables1 = {
			project: {name: formData.name},
		};

		const responseCreateProject : {createProject: Project}= await get(graphQLClient).request(createProjectMutation, variables1);
		if (formData.template != '') {
			const variables2 = {
				input: {
					argoWorkflowTemplate: JSON.parse(formData.template),
					name: formData.name,
					projectId: responseCreateProject.createProject.id,
				}
			};
			await get(graphQLClient).request(createWorkflowTemplateMutation, variables2);
		}
		modalStore.close();
        // update the project list after addition
		const responseAllProjects: { projects: Project[] } = await get(graphQLClient).request(allProjectsQuery);
		$projectsList = responseAllProjects.projects;
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
			<label class="label">
				<span>Project template</span>
				<input class="input" type="text" bind:value={formData.template} placeholder="Enter argo workflow template (JSON)..." />
			</label>
			<!-- TODO: Fill the rest -->
		</form>
		<footer class="modal-footer {parent.regionFooter}">
        <button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
        <button class="btn {parent.buttonPositive}" on:click={onCreateProjectSubmit}>Submit</button>
    </footer>
	</div>
{/if}
  