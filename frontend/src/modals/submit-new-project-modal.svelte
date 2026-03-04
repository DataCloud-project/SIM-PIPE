<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import yaml from 'js-yaml';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	import createProjectMutation from '$queries/create_project.js';
	import createWorkflowTemplateMutation from '$queries/create_workflow_template.js';
	import { cBase, cForm, cHeader } from '$styles/styles.js';

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// modalStore is a store that is used to trigger modals
	const modalStore = getModalStore();

	// variables
	let projectName: string = '';
	let projectId: string;
	let inputFilesList: FileList;
	let workflowTemplate: JSON;
	$: template_name = projectName.replaceAll(/\s+/g, '-').toLowerCase();

	// graphql request to create a new project
	async function createProject(): Promise<{
		status: number;
		error: string;
		project: { name: string; id: string };
	}> {
		const name = projectName;
		const variablesCreateProjectRequest = {
			project: { name }
		};
		return requestGraphQLClient<{ createProject: { name: string; id: string } }>(
			createProjectMutation,
			variablesCreateProjectRequest
		)
			.then((data) => ({
				status: 200,
				error: '',
				project: { name: data.createProject.name, id: data.createProject.id }
			}))
			.catch((error) => ({
				status: 500,
				error: error as string,
				project: { name: 'none', id: 'none' }
			}));
	}

	// graphql request to create a new workflow template
	async function createWorkflowTemplate(): Promise<{
		status: number;
		error: string;
		name: string;
	}> {
		const id = projectId;
		const name = template_name;
		const argoWorkflowTemplate = workflowTemplate;

		const createTemplateVariables = {
			input: {
				argoWorkflowTemplate,
				name,
				projectId: id
			}
		};

		return requestGraphQLClient<{ createWorkflowTemplate: { name: string } }>(
			createWorkflowTemplateMutation,
			createTemplateVariables
		)
			.then((data) => ({ status: 200, error: '', name: data.createWorkflowTemplate.name }))
			.catch((error) => ({ status: 500, error: error as string, name: 'none' }));
	}

	// handle input file
	async function handleInputFile(): Promise<{ template: JSON | undefined; error?: string }> {
		let template: JSON | undefined;
		const fileText = await inputFilesList[0].text();
		if (fileText !== '') {
			try {
				template = JSON.parse(fileText) as JSON;
			} catch {
				try {
					template = yaml.load(fileText) as JSON;
				} catch (error) {
					// Return error message for YAML parsing
					return {
						template: undefined,
						error: error instanceof Error ? error.message : 'Invalid YAML'
					};
				}
			}
		}
		return { template };
	}

	async function onClose(response: any): Promise<void> {
		if ($modalStore[0] && typeof $modalStore[0].response === 'function') {
			$modalStore[0].response(response);
		}
	}

	async function onSubmit(): Promise<void> {
		// First, parse the input file
		const inputResult = await handleInputFile();

		if (inputResult.error) {
			// Show error and do not proceed
			const modal: ModalSettings = {
				type: 'alert',
				title: 'Failed: Error in parsing workflow template',
				body: inputResult.error
			};
			modalStore.trigger(modal);
			await new Promise((resolve) => {
				setTimeout(resolve, 1500);
			});
			modalStore.close();
			return;
		}

		if (inputResult.template && Object.keys(inputResult.template).length > 0) {
			workflowTemplate = inputResult.template;
			// Create project first
			const createProjectResponse = await createProject();
			if (createProjectResponse.status === 200 && createProjectResponse.project.id !== 'none') {
				projectId = createProjectResponse.project.id;
				// Try to create workflow template
				const createWorkflowResponse = await createWorkflowTemplate();
				if (createWorkflowResponse.status === 200 && createWorkflowResponse.name !== 'none') {
					// Both succeeded
					const modal: ModalSettings = {
						type: 'alert',
						title: 'Success: Project and Workflow template created successfully',
						body: `Project "${createProjectResponse.project.name}" and Workflow template "${createWorkflowResponse.name}" have been created successfully.`
					};
					modalStore.trigger(modal);
					await new Promise((resolve) => {
						setTimeout(resolve, 1500);
					});
					modalStore.close();
				} else {
					// Workflow template creation failed, delete the project
					const modal: ModalSettings = {
						type: 'alert',
						title: 'Failed: Workflow template creation failed',
						body: `Project "${createProjectResponse.project.name}" was created successfully, but Workflow template "${createWorkflowResponse.name}" failed to be created.`
					};
					modalStore.trigger(modal);
					await new Promise((resolve) => {
						setTimeout(resolve, 1500);
					});
					modalStore.close();
				}
			}
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
				<span>Project name</span>
				<div class="flex">
					<input class="input" type="text" bind:value={projectName} placeholder="Enter name..." />
				</div>
			</label>
			<label class="label">
				Upload project template
				<span>
					<input class="input" type="file" bind:files={inputFilesList} />
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
