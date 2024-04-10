<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
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
	async function handleInputFile(): Promise<JSON> {
		let template: JSON = {} as JSON;
		const fileText = await inputFilesList[0].text();
		if (fileText !== '') {
			try {
				template = JSON.parse(fileText) as JSON;
			} catch {
				template = yaml.load(fileText) as JSON;
			}
		}
		return template;
	}

	async function onClose(response: any): Promise<void> {
		if ($modalStore[0] && typeof $modalStore[0].response === 'function') {
			$modalStore[0].response(response);
		}
	}

	async function onSubmit(): Promise<void> {
		const inputPromise = handleInputFile();

		const createProjectPromise = createProject();

		const [inputResponse, createProjectResponse] = await Promise.all([
			inputPromise,
			createProjectPromise
		]);

		if (createProjectResponse.status === 200) {
			projectId = createProjectResponse.project.id;
			workflowTemplate = inputResponse;

			if (Object.keys(workflowTemplate).length > 0) {
				const createWorkflowPromise = createWorkflowTemplate();
				const [createWorkflowResponse] = await Promise.all([createWorkflowPromise]);

				await onClose({ createProjectResponse, createWorkflowResponse });
			} else {
				const createWorkflowResponse = {
					status: 204,
					error: 'no workflow template provided',
					name: 'none'
				};
				await onClose({ createProjectResponse, createWorkflowResponse });
			}
		} else {
			await onClose({
				createProjectResponse,
				createWorkflowResponse: {
					status: 500,
					error: 'never created workflow template due to previous errors',
					name: 'none'
				}
			});
		}

		// close the modal
		modalStore.close();
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
