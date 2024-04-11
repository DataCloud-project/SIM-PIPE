<script lang="ts">
	import { getModalStore, FileButton } from '@skeletonlabs/skeleton';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	import refreshProjectDetails from '$lib/refresh_runs.js';
	import createDryRunMutation from '$queries/create_dry_run.js';
	import allDryRunsQuery from '$queries/get_all_dryruns.js';
	import { selectedArtifact, selectedProject } from '$stores/stores.js';
	import { cBase, cForm, cHeader } from '../styles/styles.js';
	import type { ArtifactHierarchyType, Project } from '$typesdefinitions';
	import ArtifactBrowser from './artifact-browser.svelte';

	let isOverlayOpen = false;
	let selectedTemplateTaskName = '';
	let selectedTemplateTaskArtifactName = '';
	let selectedTaskArtifactIndex = -1;
	let currentinputfiles: FileList;

	// Store - Exposes the modal store to this component
	const modalStore = getModalStore();

	// Props - Exposes parent props to this component
	export let parent: SvelteComponent;

	// TODO: input artifacts are enriched with raw data from local files.
	// That is, the local files text content is written directly into the template!!! This is risky and should be changed!
	// templateContainerInputs contains argo workflow template container inputs.
	const templateContainerInputs: any = {};

	// holds information about selected input data (raw files and artifacts)
	const inputdata: { [task_name: string]: { [template_task_artifact_index: number]: InputData } } =
		{};

	const argoWorkflowTemplate = $selectedProject?.workflowTemplates[0].argoWorkflowTemplate;
	const currentArgoWorkflowTemplates = argoWorkflowTemplate.spec.templates;
	$: console.log('currentArgoWorkflowTemplate', currentArgoWorkflowTemplates);

	type InputData = {
		template_task_name: string;
		template_artifact_name: string;
		template_task_artifact_index: number;
		is_raw: boolean;
		is_artifact: boolean;
		raw?: FileDataContent;
		artifact?: ArtifactDataContent;
	};

	type ArtifactDataContent = {
		artifact_path: string;
		artifact_bucket: string;
	};

	type FileDataContent = {
		filename: string;
	};

	type Parameters = {
		name: string;
		value: string;
	}[];

	type MinioObjectDetail = {
		path: string;
		bucket: string;
	};

	// We have been using raw input. Now we will use miniobrowser to select input files. Currently need to support both useRawInput and useMinio
	// raw input comes from formData.files.
	type Task = {
		name: string;
		template: string;
		arguments: { parameters: Parameters };
		dependencies?: string[];
		useRawInput: boolean;
		useMinio: boolean;
		inputobject?: MinioObjectDetail;
	};

	type TemplateContainerArtifactInput = {
		artifacts: [
			{
				name: string; // the given name of the input artifact in the template container
				path: string; // the path to the input artifact in the container
				mode: 644; // file mode (read-write for owner, read-only for group and others)
				s3?: S3Input; // s3 input artifact details
			}
		];
	};

	type TemplateContainerRawInput = {
		artifacts: [
			{
				name: string; // the given name of the input artifact in the template container
				path: string; // the path to the input artifact in the container
				mode: 644; // file mode (read-write for owner, read-only for group and others)
				raw: { data: string }; // raw input artifact details
			}
		];
	};

	type S3Input = {
		key: string; // path to minio object
		endpoint: string; // minio endpoint
		bucket: string; // minio bucket
		insecure: true;
		accessKeySecret: {
			name: string;
			key: string;
		};
		secretKeySecret: {
			name: string;
			key: string;
		};
	};

	function openOverlay(
		template_task_name: string,
		artifact_name: string,
		task_artifact_index: number
	): void {
		console.log('openOverlay');
		selectedTemplateTaskName = template_task_name;
		selectedTemplateTaskArtifactName = artifact_name;
		selectedTaskArtifactIndex = task_artifact_index;
		isOverlayOpen = true;
	}

	const closeOverlay = (): void => {
		console.log('closeOverlay');
		isOverlayOpen = false;
		$selectedArtifact = undefined;
	};

	function createDefaultS3Input(): S3Input {
		return {
			key: '', // path to minio object - e.g. /path/to/object - this must be provided from minio artifact browser
			bucket: '', // minio bucket - this must be provided from minio artifact browser
			endpoint: 'simpipe-minio:9000',
			insecure: true,
			accessKeySecret: {
				name: 'simpipe-minio',
				key: 'root-user'
			},
			secretKeySecret: {
				name: 'simpipe-minio',
				key: 'root-password'
			}
		};
	}

	// Receives message from ArtifactBrowser - returns details of selected artifact and template task name
	function handleMessage(event: {
		detail: {
			selected_artifact: ArtifactHierarchyType;
			template_task_name: string;
			template_task_artifact_name: string;
		};
	}): void {
		console.log('triggerInsertArtifactInput');
		const selectedArtifact = event.detail.selected_artifact;
		const selectedTemplateTaskName = event.detail.template_task_name;
		const selectedTemplateTaskArtifactName = event.detail.template_task_artifact_name;
		const selectedTemplateTaskArtifactIndex = selectedTaskArtifactIndex;

		const template = currentArgoWorkflowTemplates.find(
			(template: any) => template.name === selectedTemplateTaskName
		);
		const inputArtifact = template.inputs.artifacts.find(
			(artifact: any) => artifact.name === selectedTemplateTaskArtifactName
		);
		// pop inputArtifact.raw
		if ('raw' in inputArtifact) {
			delete inputArtifact.raw;
		}
		inputArtifact.s3 = createDefaultS3Input();
		inputArtifact.s3.key = selectedArtifact.path;
		inputArtifact.s3.bucket = selectedArtifact.bucket;
		currentArgoWorkflowTemplates
			.find((template: any) => template.name === selectedTemplateTaskName)
			.inputs.artifacts.find(
				(artifact: any) => artifact.name === selectedTemplateTaskArtifactName
			).s3 = inputArtifact.s3;

		const inputdataData: InputData = {
			template_task_name: selectedTemplateTaskName,
			template_artifact_name: selectedTemplateTaskArtifactName,
			template_task_artifact_index: selectedTemplateTaskArtifactIndex,
			is_raw: false,
			is_artifact: true,
			artifact: {
				artifact_path: selectedArtifact.path,
				artifact_bucket: selectedArtifact.bucket
			}
		};
		if (!inputdata[selectedTemplateTaskName]) {
			// initialize empty array
			inputdata[selectedTemplateTaskName] = [];
		}
		inputdata[selectedTemplateTaskName][selectedTemplateTaskArtifactIndex] = inputdataData;
		console.log('handleMessage inputdata', inputdata);
	}

	async function triggerInsertRawInput(
		template_task_name: string,
		template_artifact_name: string,
		task_artifact_index: number
	): Promise<void> {
		// when a file is uploaded, the raw input is updated similarly to handleMessage event from the ArtifactBrowser
		console.log('triggerInsertRawInput');
		const selectedTemplateTaskName = template_task_name;
		const selectedTemplateTaskArtifactName = template_artifact_name;
		const selectedTemplateTaskArtifactIndex = task_artifact_index;
		const files: FileList = currentinputfiles;
		const text = await files[0].text();
		const filename = files[0].name;

		const inputdataData: InputData = {
			template_task_name: selectedTemplateTaskName,
			template_artifact_name: selectedTemplateTaskArtifactName,
			template_task_artifact_index: task_artifact_index,
			is_raw: true,
			is_artifact: false,
			raw: { filename }
		};
		if (!inputdata[selectedTemplateTaskName]) {
			// initialize empty array
			inputdata[selectedTemplateTaskName] = [];
		}
		inputdata[selectedTemplateTaskName][selectedTemplateTaskArtifactIndex] = inputdataData;

		const template = currentArgoWorkflowTemplates.find(
			(template: any) => template.name === selectedTemplateTaskName
		);
		const inputArtifact = template.inputs.artifacts.find(
			(artifact: any) => artifact.name === selectedTemplateTaskArtifactName
		);
		// pop inputArtifact.s3
		if ('s3' in inputArtifact) {
			delete inputArtifact.s3;
		}
		inputArtifact.raw = { data: text };
		currentArgoWorkflowTemplates
			.find((template: any) => template.name === selectedTemplateTaskName)
			.inputs.artifacts.find(
				(artifact: any) => artifact.name === selectedTemplateTaskArtifactName
			).raw = inputArtifact.raw;
	}

	/* 
	function createDefaultTemplateContainerRawInput(): TemplateContainerRawInput {
		return {
			artifacts: [
				{
					name: '', // the given name of the input artifact in the template container
					path: '', // the path to the input artifact in the container
					mode: 644, // file mode (read-write for owner, read-only for group and others)
					raw: { data: '' } // raw input artifact details
				}
			]
		};
	}

	function createDefaultTemplateContainerArtifactInput(): TemplateContainerArtifactInput {
		return {
			artifacts: [
				{
					name: '', // the given name of the input artifact in the template container
					path: '', // the path to the input artifact in the container
					mode: 644, // file mode (read-write for owner, read-only for group and others)
					s3: createDefaultS3Input()
				}
			]
		};
	} */

	function parsetemplateTaskList(): Task[] {
		// disabling; could not resolve eslint error  Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError  55:53  warning  Unexpected any. Specify a different type
		const {
			spec: { templates }
		} = $selectedProject?.workflowTemplates[0]?.argoWorkflowTemplate;
		// console.log(templates);
		// dag or steps?
		const dag = templates.find((template: any) => template.dag);
		const steps = templates.find((template: any) => template.steps);
		// console.log('dag', dag); array of tasks
		// console.log('steps', steps); array of arrays of tasks
		let tasks: Task[] = [];
		if (dag) {
			console.log('dag', dag);
			tasks = dag.dag.tasks;
		} else if (steps) {
			console.log('steps', steps);
			const tasks = [];
			for (const step of steps.steps) {
				tasks.push(...step);
			}
		}
		// extract input artifacts from template
		templates.forEach((template: { name: string; inputs: any }) => {
			templateContainerInputs[template.name] = template.inputs;
		});
		console.log('tasks', tasks);
		console.log('templateContainerInputs', templateContainerInputs);
		return tasks;
	}
	const templateTaskList = parsetemplateTaskList() || [];

	// get modified workflow template with updated template inputs
	function getModifiedWorkflowTemplate2(): any {
		const newWorkflowTemplate = argoWorkflowTemplate;
		newWorkflowTemplate.spec.templates = currentArgoWorkflowTemplates;
		// console.log('originalWorkflowTemplate', argoWorkflowTemplate);
		// console.log('newWorkflowTemplate', newWorkflowTemplate);
		newWorkflowTemplate.metadata = { generateName: newWorkflowTemplate.metadata.generateName };
		return newWorkflowTemplate;
	}

	async function onCreateDryRunSubmit(): Promise<void> {
		modalStore.close();

		const modifiedWorkflowTemplate = await getModifiedWorkflowTemplate2();
		// const modifiedWorkflowTemplate = await newWorkflowTemplate(argoWorkflowTemplate);

		const createDryRunMutationVariables = {
			input: {
				projectId: $selectedProject?.id,
				argoWorkflow: modifiedWorkflowTemplate
			}
		};

		// TODO: why is this here? Can this following line be removed?
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 1500));

		try {
			const responseCreateDryRun: { createDryRun: { id: string } } = await requestGraphQLClient(
				createDryRunMutation,
				createDryRunMutationVariables
			);
			// refresh dry runs list
			const response: { project: Project } = await requestGraphQLClient(allDryRunsQuery, {
				projectId: $selectedProject?.id
			});
			$selectedProject = response.project;
			const createDryRunMessageModal: ModalSettings = {
				type: 'alert',
				title: 'New dry run created&#10024;!',
				body: `New dry run ID: ${responseCreateDryRun?.createDryRun?.id}`
			};
			modalStore.trigger(createDryRunMessageModal);

			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 1500));
			modalStore.close();
			await refreshProjectDetails();
			modalStore.clear();
		} catch (error) {
			// TODO: handle error
			console.error('Failed to create dry run', error);
			let createDryRunMessageModal: ModalSettings;
			// eslint-disable-next-line unicorn/prefer-ternary
			if ((error as Error).message.includes('PayloadTooLargeError')) {
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Failed!',
					body: 'Input file size exceeded limit (90KB)!'
				};
			} else {
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Failed to create dry run!',
					body: 'Check dry run inputs!'
				};
			}
			modalStore.trigger(createDryRunMessageModal);

			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 2500));
			modalStore.close();
		}
	}

	$: console.log('inputdata', inputdata);
</script>

{#if $modalStore[0]}
	<div class="modal-dry-run {cBase} overflow-y-auto max-h-full">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			{#if templateTaskList.length > 0}
				{#each templateTaskList as task, i}
					<div class="ml-5">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label><b>{i + 1}. {task.name}</b></label>
						<label
							>Template: <span>
								<input class="variant-soft-surface" type="text" value={task.template} readonly />
							</span></label
						>
						{#if task.dependencies}
							<label
								>Dependencies: <span>
									<input
										class="variant-soft-surface"
										type="text"
										value={task.dependencies}
										readonly
									/>
								</span></label
							>
						{/if}
						{#if Object.keys(templateContainerInputs[task.name]).length > 0}
							<br />
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label>Upload Input files </label>
							{#each templateContainerInputs[task.name].artifacts || [] as artifact, k}
								<label for={artifact.name}>
									<span>
										<div class="grid grid-rows-2 grid-cols-3 justify-items-center items-center">
											<div>
												<span>{artifact.name}</span>
											</div>
											<div>
												{#if inputdata[task.name] && inputdata[task.name][k] && inputdata[task.name][k].is_raw}
													<span>{inputdata[task.name][k].raw?.filename}</span>
												{:else}
													<span></span>
												{/if}
											</div>
											<div>
												{#if inputdata[task.name] && inputdata[task.name][k] && inputdata[task.name][k].is_artifact}
													<span
														>{inputdata[task.name][k].artifact?.artifact_bucket}
														{inputdata[task.name][k].artifact?.artifact_path}</span
													>
												{:else}
													<span></span>
												{/if}
											</div>
											<div></div>
											<div>
												<FileButton
													id={artifact.name}
													name={artifact.name}
													bind:files={currentinputfiles}
													on:change={() => triggerInsertRawInput(task.name, artifact.name, k)}
												>
													Upload local file
												</FileButton>
											</div>
											<div>
												<button
													type="button"
													class="btn variant-soft-primary"
													on:click={() => openOverlay(task.name, artifact.name, k)}
													>Browse artifacts</button
												>
											</div>
										</div>
									</span>
								</label>
								<br />
							{/each}
						{/if}
						{#each templateTaskList[i].arguments?.parameters || [] as param, j}
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label>Enviroment parameters:</label>
							<label class="ml-5"
								>{param.name}:
								<span>
									<input
										class="input variant-form-material"
										type="text"
										bind:value={templateTaskList[i].arguments.parameters[j].value}
									/>
								</span></label
							>
						{/each}
					</div>
				{/each}
			{/if}
		</form>
		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button class="btn {parent.buttonPositive}" on:click={onCreateDryRunSubmit}>Submit</button>
		</footer>
	</div>
{/if}

<ArtifactBrowser
	templateTaskName={selectedTemplateTaskName}
	templateTaskArtifactName={selectedTemplateTaskArtifactName}
	isOpen={isOverlayOpen}
	close={closeOverlay}
	on:message={handleMessage}
/>
