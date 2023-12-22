<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { error } from '@sveltejs/kit';

	$lib / graphql - utils;
	import { Modal, type ModalSettings, modalStore } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';

	import allProjectsQuery from '../../../queries/get-all-projects.js';
	import getWorkflowQuery from '../../../queries/get-workflow-template.js';
	import updateCredentialMutation from '../../../queries/update-workflow-template.js';
	import { selectedCredential, selectedProject } from '../../../stores/stores';
	import type { Project } from '../../../types';

	const hideModal = false;
	let alertModal = false;

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

	async function onSubmitForm() {
		console.log('submitting form');

		if (!$selectedProject) {
			throw error(404, 'Project not found / project undefined');
		}

		const response = requestGraphQLClient(getWorkflowQuery, { name: $selectedProject.name });

		response
			.then((data: any) => {
				template = data.workflowTemplate.argoWorkflowTemplate;
				template.spec.imagePullSecrets = [{ name: $selectedCredential.name }];
				// update path of template images:
				template.spec.templates.forEach((template: any) => {
					if (template.container) {
						let { image } = template.container;
						image = image.split('/').slice(-1);
						template.container.image = `${$selectedCredential.server}/${image}`;
					}
				});

				if (!$selectedProject) {
					throw error(404, 'Project not found / project undefined');
				}

				const input = {
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
				const workflowTemplateUpdatedMessageModal: ModalSettings = {
					type: 'alert',
					title: 'Secret added to project workflow! 🎉',
					body: `<p>Project: ${$selectedProject.name}</p><p>Now uses registry: ${$selectedCredential.server}</p>`
				};
				alertModal = true;
				modalStore.trigger(workflowTemplateUpdatedMessageModal);
				await new Promise((resolve) => setTimeout(resolve, 3000));
				modalStore.close();
				modalStore.clear();
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

<Modal />
