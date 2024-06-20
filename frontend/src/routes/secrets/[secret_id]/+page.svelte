<script lang="ts">
	import { ProgressBar, getModalStore } from '@skeletonlabs/skeleton';
	import { error } from '@sveltejs/kit';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { selectedCredential, selectedProject } from '$stores/stores';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import type { Project } from '$typesdefinitions';
	import allProjectsQuery from '$queries/get_all_projects.js';
	import getWorkflowQuery from '$queries/get_workflow_template.js';
	import updateCredentialMutation from '$queries/update_workflow_template';
	import { goto } from '$app/navigation';

	const modalStore = getModalStore();

	// argo workflow template
	// let template: any;

	interface ResponseType {
		workflowTemplate: {
			argoWorkflowTemplate: any; // Replace 'any' with the actual type
		};
	}

	interface ImageComponents {
		registryUrl: string;
		port: string;
		namespace: string;
		image: string;
		tag: string;
	}

	const getProjectsList = async (): Promise<Project[]> => {
		const response: { projects: Project[] } = await requestGraphQLClient(allProjectsQuery);
		return response.projects;
	};

	const getDataPromise = getProjectsList();
	const projectsList: Project[] = [];

	// eslint-disable-next-line @typescript-eslint/no-floating-promises, unicorn/prefer-top-level-await
	getDataPromise.then((data) => {
		projectsList.push(...data);
	});

	async function triggerWorkflowUpdatedMessageModal(): Promise<void> {
		const projectName = $selectedProject ? $selectedProject.name : 'undefined';
		if (!$selectedProject) {
			throw new Error('Project not found / project undefined');
		}
		const registryServer = $selectedCredential.server ?? 'undefined';
		const workflowTemplateUpdatedMessageModal: ModalSettings = {
			type: 'alert',
			title: 'Secret added to project workflow! 🎉',
			body: `<p>Project: ${projectName}</p><p>Now uses registry: ${registryServer}</p>`
		};
		modalStore.trigger(workflowTemplateUpdatedMessageModal);
		await new Promise((resolve) => {
			setTimeout(resolve, 3000);
		});
		modalStore.close();
		modalStore.clear();
	}

	function extractImageStringComponents(imageRef: string): ImageComponents {
		let registryUrl = '';
		let port = '';
		let namespace = '';
		let image = '';
		let tag = '';

		if (imageRef.startsWith('/')) { imageRef = imageRef.substring(1)}

		let parts = imageRef.split('/');

		if (parts[0].includes(':')) {
			// Case 1: registry-server-url/organization/image
			let urlParts = parts[0].split(':');
			registryUrl = urlParts[0];
			port = urlParts[1];
			namespace = parts[1];
			[image, tag] = parts[2].split(':');
		} else if (parts.length === 2) {
			// Case 2: organization/image
			namespace = parts[0];
			[image, tag] = parts[1].split(':');
		} else {
			// Case 3: image
			[image, tag] = parts[0].split(':');
		}

		return { registryUrl, port, namespace, image, tag };
	}

	function getNewImageFullName(components: ImageComponents, finalRegistryUrl: string, finalPort: string): string {
		let { registryUrl, port, namespace, image, tag } = components;
		let imageRefFullName = `${finalRegistryUrl}:${finalPort}/${namespace}/${image}`
		if (tag) {
			imageRefFullName += `:${tag}`;
		}
		return imageRefFullName;
	}	

	async function onSubmitForm(): Promise<void> {
		console.log('submitting form');

		if (!$selectedProject) {
			// eslint-disable-next-line @typescript-eslint/no-throw-literal
			throw error(404, 'Project not found / project undefined');
		}

		const response: ResponseType = await requestGraphQLClient(getWorkflowQuery, {
			name: $selectedProject.name
		});

		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
		const template = response.workflowTemplate.argoWorkflowTemplate;
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
		template.spec.imagePullSecrets = [{ name: $selectedCredential.name }];
		// update path of template images:
		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
		template.spec.templates.forEach((template: any) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
			if (template.container) {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
				let { image } = template.container;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				image = image.split('/').slice(-1);
				img1 = registry.com:5000/namespace/image:tag
				img2 = namespace/image:tag
				img3 = image:tag
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
				template.container.image = `${$selectedCredential.server}/${image}`;
			}
		});

		const input = {
			update: {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				argoWorkflowTemplate: template,
				name: $selectedProject.name
			}
		};

		await requestGraphQLClient(updateCredentialMutation, input);

		await triggerWorkflowUpdatedMessageModal();

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/templates/${$selectedProject.name}`);
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
					<!-- eslint-disable-next-line  @typescript-eslint/no-floating-promises @typescript-eslint/explicit-function-return-type -->
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
