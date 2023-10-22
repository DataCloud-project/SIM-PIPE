<script lang="ts">
	import { cBase, cHeader, cForm, optional } from '../../../../styles/styles.js';
	import { Modal, modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { selectedProject } from '../../../../stores/stores.js';
	import createDryRunMutation from '../../../../queries/create_dry_run.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import type { Project } from '../../../../types.js';
	import refreshProjectDetails from '../../../../lib/refresh_runs.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	export let parent: any;
	type Parameters = {
		name: string;
		value: string;
	}[];

	type Task = {
		name: string;
		template: string;
		arguments: { parameters: Parameters };
		dependencies?: string[];
	};

	interface Template {
		dag?: any;
	}

	let formData = {
		name: '',
		files: [],
		dagTemplate: { dag: { tasks: [] } }
	};

	const input_artifacts: any = {};

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
			// extract input artifacts from template
			templates.forEach((template: { name: string; inputs: any }) => {
				input_artifacts[template.name] = template.inputs;
			});
			return tasks;
		}
	}
	const taskList = parseTaskList() || [];
	let hideModal = false;
	let alertModal = false;

	// modify workflow template from project to create a valid argoWorkflow input for create new dryrun
	async function newWorkflowTemplate(template: { metadata: any; spec: any }) {
		const newWorkflowTemplate = template;
		if (formData.files.length != 0) {
			newWorkflowTemplate.spec.templates.forEach(
				async (template: { inputs: any; name: string }) => {
					// find the initial step (currently assuming there is only 1 initial step)
					let initial_task_name = '';
					for (let task of taskList) {
						if (!task.dependencies) {
							// initial step has no dependencies
							initial_task_name = task.name;
							break;
						}
					}
					// change input files content in the template for the initial step
					// if any files are uploaded
					if (template.name == initial_task_name) {
						input_artifacts[taskList[0].name].artifacts.forEach(
							async (artifact: { raw: { data: string } }, index: number) => {
								const files = formData.files[index] as unknown as FileList;
								if (files) {
									let text = await files[0].text();
									artifact.raw.data = `${text}`;
								} else {
									console.log('Input file not uploaded!');
								}
							}
						);
					}
				}
			);
		}
		newWorkflowTemplate.metadata =
			formData.name == ''
				? { generateName: newWorkflowTemplate.metadata.generateName }
				: { name: formData.name };
		return newWorkflowTemplate;
	}

	async function onCreateDryRunSubmit(): Promise<void> {
		modalStore.close();
		hideModal = true;
		const modifiedWorkflowTemplate = await newWorkflowTemplate(
			$selectedProject?.workflowTemplates[0].argoWorkflowTemplate
		);
		const variables = {
			input: {
				projectId: $selectedProject?.id,
				argoWorkflow: modifiedWorkflowTemplate
			}
		};
		await new Promise((resolve) => setTimeout(resolve, 1500));

		try {
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
			// TODO: handle error
			let createDryRunMessageModal: ModalSettings;
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
			alertModal = true;
			await new Promise((resolve) => setTimeout(resolve, 2500));
			modalStore.close();
		}
	}
</script>

{#if !hideModal && $modalStore[0]}
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
					placeholder="Enter name..."
					required
				/>
			</label>

			{#if taskList.length > 0}
				{#each taskList as task, i}
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
						{#if Object.keys(input_artifacts[task.name]).length != 0}
							<br />
							<!-- svelte-ignore a11y-label-has-associated-control -->
							<label>Upload Input files </label>
							{#each input_artifacts[task.name].artifacts || [] as artifact, k}
								<!-- svelte-ignore a11y-label-has-associated-control -->
								<label>
									{artifact.name}
									<span>
										<input class="input" type="file" bind:files={formData.files[k]} />
									</span>
								</label>
								<br />
							{/each}
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
