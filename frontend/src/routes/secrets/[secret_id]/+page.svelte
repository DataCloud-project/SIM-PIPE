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
		imagePath: string;
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

	function extractImageStringComponents(imageReference: string): ImageComponents {
		// imageReference = registryUrl/imagePath:tag
		// where imagePath is a path with multiple parts separated by '/'
		// Example cases:
		// let img0 = 'https://registry.com/namespace/image:tag';
		// let img1 = 'registry.com:5000/namespace/image:tag';
		// let img2 = '/namespace/image';
		// let img3 = 'organization/myimage:reftag';
		// let img4 = 'image:tag';
		// let img5 = 'image';

		// input
		const imageRef = imageReference;

		// output
		let registryUrl = '';
		let imagePath = '';

		if (imageRef.startsWith('http://') || imageRef.startsWith('https://')) {
			const urlParts = imageRef.split('/');
			// eslint-disable-next-line prefer-destructuring
			registryUrl = urlParts[2];
			imagePath = urlParts.slice(3).join('/');
		} else {
			const parts = imageRef.split('/');
			const firstPart = parts[0];
			if (firstPart.includes(':') || firstPart.includes('.')) {
				if (parts.length > 1) {
					// server.url:port/namespace/image:tag
					// eslint-disable-next-line prefer-destructuring
					registryUrl = firstPart;
					imagePath = parts.slice(1).join('/');
				} else {
					// image:tag, there is no server url
					// eslint-disable-next-line prefer-destructuring
					imagePath = firstPart;
				}
			} else {
				// remove leading / if present
				imagePath = imageRef.startsWith('/') ? imageRef.slice(1) : imageRef;
			}
		}

		return {
			registryUrl,
			imagePath
		};
	}

	function getNewImageFullName(components: ImageComponents, registryReference: string): string {
		// imageRefFullName = registryReference/namespace/image:tag
		const { imagePath } = components;
		const imageRefFullName = `${registryReference}/${imagePath}`;
		return imageRefFullName;
	}

	/*
	function testCases(registryReference: string) {
		let img0 = 'https://registry.com/namespace/image:tag';
		let img1 = 'registry.com:5000/namespace/image:tag';
		let img2 = '/namespace/image';
		let img3 = 'organization/myimage:reftag';
		let img4 = 'image:tag';
		let img5 = 'image';
		let img6 = 'registry.com/namespace/image';
		console.log('img0', getNewImageFullName(extractImageStringComponents(img0), registryReference));
		console.log('img1', getNewImageFullName(extractImageStringComponents(img1), registryReference));
		console.log('img2', getNewImageFullName(extractImageStringComponents(img2), registryReference));
		console.log('img3', getNewImageFullName(extractImageStringComponents(img3), registryReference));
		console.log('img4', getNewImageFullName(extractImageStringComponents(img4), registryReference));
		console.log('img5', getNewImageFullName(extractImageStringComponents(img5), registryReference));
		console.log('img6', getNewImageFullName(extractImageStringComponents(img6), registryReference));
	}
	*/

	function getNewImageFullNameFromImageRef(imageRef: string, registryReference: string): string {
		const imageComponents = extractImageStringComponents(imageRef);
		// testCases(registryReference);
		return getNewImageFullName(imageComponents, registryReference);
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
				const { image } = template.container;
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
				const newImageFullName = getNewImageFullNameFromImageRef(image, $selectedCredential.server);
				console.log('newImageFullName', newImageFullName);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, no-param-reassign
				template.container.image = newImageFullName;
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
