<script lang="ts">
	import { selectedCredential, selectedProject } from '$stores/stores';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import type { Project } from '$typesdefinitions';
	import allProjectsQuery from '$queries/get_all_projects.js';
	import getWorkflowQuery from '$queries/get_workflow_template.js';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { error } from '@sveltejs/kit';
	import updateCredentialMutation from '$queries/update_workflow_template';
	import { Modal, getModalStore } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();

	const getProjectsList = async (): Promise<Project[]> => {
		const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		return response.projects;
	};

	const getDataPromise = getProjectsList();
	const projectsList: Project[] = [];

	getDataPromise.then((data) => {
		projectsList.push(...data);
	});

	let template: any;
	let submit_response: any;

	async function triggerWorkflowUpdatedMessageModal() {
		let project_name = $selectedProject ? $selectedProject.name : 'undefined';
		if (!$selectedProject) {
			throw new Error('Project not found / project undefined');
		}
		let registry_server = $selectedCredential.server ? $selectedCredential.server : 'undefined';
		const workflowTemplateUpdatedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Secret added to project workflow! 🎉',
			body: `<p>Project: ${project_name}</p><p>Now uses registry: ${registry_server}</p>`
		};
		modalStore.trigger(workflowTemplateUpdatedMessageModal);
		await new Promise((resolve) => setTimeout(resolve, 3000));
		modalStore.close();
		modalStore.clear();
	}

	async function onSubmitForm() {
		console.log('submitting form');

		if (!$selectedProject) {
			throw error(404, 'Project not found / project undefined');
		}

		const response = requestGraphQLClient(getWorkflowQuery, { name: $selectedProject.name });

		response
			.then((data: any) => {
				template = data.workflowTemplate.argoWorkflowTemplate;
				template.spec['imagePullSecrets'] = [{ name: $selectedCredential.name }];
				// update path of template images:
				template.spec.templates.forEach((template: any) => {
					if (template.container) {
						let image = template.container.image;
						image = image.split('/').slice(-1);
						template.container.image = $selectedCredential.server + '/' + image;
					}
				});

				if (!$selectedProject) {
					throw error(404, 'Project not found / project undefined');
				}

				let input = {
					update: {
						argoWorkflowTemplate: template,
						name: $selectedProject.name
					}
				};

				const submit_response = requestGraphQLClient(updateCredentialMutation, input);
			})
			.catch((error) => {
				console.log(error);
				throw error(500, error);
			})
			.finally(async () => {
				if (!$selectedProject) {
					throw error(404, 'Project not found / project undefined');
				}
				triggerWorkflowUpdatedMessageModal();
				goto(`/templates/${$selectedProject.name}`);
			});
	}
</script>

<!-- Page Header -->
<div class="flex w-full content-center p-10">
	<div class="w-full h-screen">
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<div class="flex flex-row justify-start space-x-5">
				<h1>Secrets / {$selectedCredential.name}</h1>
			</div>
			<div class="grid grid-cols-1 w-1/2">
				<div class="card p-5 w-full">
					<h1 class="text-xl text-left">
						Add secret <p class="text-sky-500 underline">{$selectedCredential.name}</p>
						to project:
					</h1>
					<div>
						<label class="label">
							<select class="select" bind:value={$selectedProject}>
								{#each projectsList as project}
									<option value={project}>{project.name}</option>
								{/each}
							</select></label
						>
					</div>
					<br />
					<button
						type="button"
						class="btn btn-sm variant-filled-warning"
						on:click={() => {
							onSubmitForm();
						}}>Submit</button
					>
				</div>
			</div>
		{/await}
	</div>
</div>
