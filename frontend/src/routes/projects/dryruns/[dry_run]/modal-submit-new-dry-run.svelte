<script lang="ts">
	import { cBase, cHeader, cForm, optional } from '../../../../styles/styles.js';
	import { Modal, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { selectedProject } from '../../../../stores/stores.js';
	import createDryRunMutation from '../../../../queries/create_dry_run.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import type { Project, Template, Task } from '../../../../types.js';
	import refreshProjectDetails from '../../../../lib/refresh_runs.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	export let parent: any;

	enum FileUploadType {
		Raw,
		S3
	}

	let formData = {
		name: '',
		files: [],
		s3Key: '',
		filesize: '',
		dagTemplate: { dag: { tasks: [] } }
	};

	// stores the names of input files expected for initial steps while parsing
	const input_artifacts: any = {};
	let initial_task_name = ''; //TODO: make this a list to accomodate multiple initial steps in the pipeline
	let initial_task_index = -1; //TODO: make this a list to accomodate multiple initial steps in the pipeline
	const taskList = parseTaskList() || [];
	let alertModal = false;

	function parseTaskList() {
		// only valid for dag format https://argoproj.github.io/argo-workflows/walk-through/dag/
		if (
			$selectedProject &&
			$selectedProject.workflowTemplates &&
			$selectedProject.workflowTemplates[0]?.argoWorkflowTemplate
		) {
			// disabling; could not resolve eslint error  Unsafe usage of optional chaining. If it short-circuits with 'undefined' the evaluation will throw TypeError  55:53  warning  Unexpected any. Specify a different type
			/* eslint-disable */
			const {
				spec: { templates }
			} = $selectedProject?.workflowTemplates[0]?.argoWorkflowTemplate;
			/* eslint-disable */
			formData.dagTemplate = templates.find((template: Template) => template.dag);
			const tasks: Task[] = formData.dagTemplate ? formData.dagTemplate.dag?.tasks : [];
			// TODO: extend; find the initial step (currently assuming there is only 1 initial step)
			for (let task of tasks) {
				if (!task.dependencies) {
					// initial step has no dependencies
					initial_task_name = task.name;
					// initial_task_index = index;
					break;
				}
			}

			// extract input artifacts from initial step in the template
			templates.forEach((template: { name: string; inputs: any }) => {
				// TODO: only 1 initial input file is considered
				if (template.name == initial_task_name) {
					if (template.inputs.artifacts?.[0].s3) {
						// the input file is of type s3
						input_artifacts[template.name] = { inputs: template.inputs, type: FileUploadType.S3 };
					} else if (template.inputs.artifacts?.[0].raw) {
						// the input file is of type raw
						input_artifacts[template.name] = { inputs: template.inputs, type: FileUploadType.Raw };
					}
				}
			});
			return tasks;
		}
	}

	// modify workflow template from project to create a valid argoWorkflow input for create new dryrun
	async function newWorkflowTemplate(template: { metadata: any; spec: any }) {
		const newWorkflowTemplate = template;
		if (Object.keys(input_artifacts).length != 0) {
			// if pipeline has initial input files
			try {
				for (const [index, artifact] of input_artifacts[
					initial_task_name
				]?.inputs.artifacts.entries()) {
					// for input file type = raw, replace the raw contents in the workflow template
					if (input_artifacts[initial_task_name].type == FileUploadType.Raw) {
						const files = formData.files[index] as unknown as FileList;
						if (files) {
							let text = await files[0].text();
							artifact.raw.data = `${text}`;
						} else {
							throw new Error('Initial input file is not uploaded!');
						}
					} else if (input_artifacts[initial_task_name].type == FileUploadType.S3) {
						artifact.s3.key = formData.s3Key;
					}
				}
			} catch (error) {
				throw error;
			}
		}
		await new Promise((resolve) => setTimeout(resolve, 1500));

		newWorkflowTemplate.metadata =
			formData.name == ''
				? { generateName: newWorkflowTemplate.metadata.generateName }
				: { generateName: formData.name };
		// TODO: current fix is to have the user enter the input filesize manually
		newWorkflowTemplate.metadata.annotations = {
			filesize: formData.filesize,
			initial_task_name: initial_task_name
		};
		return newWorkflowTemplate;
	}

	async function onCreateDryRunSubmit(): Promise<void> {
		modalStore.close();
		try {
			const modifiedWorkflowTemplate = await newWorkflowTemplate(
				$selectedProject?.workflowTemplates[0].argoWorkflowTemplate
			);
			await new Promise((resolve) => setTimeout(resolve, 1500));
			const variables = {
				input: {
					projectId: $selectedProject?.id,
					argoWorkflow: modifiedWorkflowTemplate
				}
			};

			const responseCreateDryRun: { createDryRun: { id: string } } = await requestGraphQLClient(
				createDryRunMutation,
				variables
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
			alertModal = true;
			await new Promise((resolve) => setTimeout(resolve, 1500));
			modalStore.close();
			await refreshProjectDetails();
			modalStore.clear();
		} catch (error) {
			console.log(error);
			const message = (error as Error).message;
			let createDryRunMessageModal: ModalSettings;
			if (message.includes('PayloadTooLargeError')) {
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Failed!',
					body: 'Input file size exceeded limit (90KB)!'
				};
			} else {
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Failed to create dry run!',
					body: `${message}`
				};
			}
			modalStore.trigger(createDryRunMessageModal);
			alertModal = true;
			await new Promise((resolve) => setTimeout(resolve, 2500));
			modalStore.close();
		}
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase} overflow-y-auto max-h-full">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Dry run name - <span style={optional}>Optional</span> </span>
				<input
					class="input"
					type="text"
					bind:value={formData.name}
					placeholder="Enter name generator..."
					required
				/>
			</label>

			{#if taskList.length > 0}
				{#each taskList as task, i}
					<div class="ml-5">
						<!-- svelte-ignore a11y-label-has-associated-control -->
						<label><b>{i + 1}. {task.name}</b></label>
						<!-- <label
							>Template: <span>
								<input class="variant-soft-surface" type="text" value={task.template} readonly />
							</span></label
						> -->
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
						<!-- input artifact option for initial step in the pipeline -->
						{#if task.name == initial_task_name}
							<br />
							<!-- svelte-ignore a11y-label-has-associated-control -->
							{#if input_artifacts?.[task.name]?.type == FileUploadType.Raw}
								<p>Upload Input files</p>
								{#each input_artifacts[task.name].inputs.artifacts || [] as artifact, k}
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<label>
										<span>
											{artifact.name}
											<input class="input" type="file" bind:files={formData.files[k]} />
										</span>
									</label>
									<br />
								{/each}
							{:else if input_artifacts?.[task.name]?.type == FileUploadType.S3}
								{#each input_artifacts[task.name].inputs.artifacts || [] as artifact}
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<label>
										Enter S3 key for file input: <span class="italic">{artifact.name} </span>
										<input
											class="input variant-form-material"
											type="text"
											bind:value={formData.s3Key}
										/>
									</label>
									<br />
								{/each}
							{/if}
							<label>
								Enter total input file size in bytes:
								<span>
									<input class="input" type="text" bind:value={formData.filesize} />
								</span>
							</label>
						{/if}
						{#each taskList[i].arguments?.parameters || [] as param, j}
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label>Enviroment parameters:</label>
							<label class="ml-5"
								>{param.name}:
								<span>
									<input
										class="input variant-form-material"
										type="text"
										bind:value={taskList[i].arguments.parameters[j].value}
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

{#if alertModal}
	<Modal />
{/if}