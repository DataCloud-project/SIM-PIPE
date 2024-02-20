<script lang="ts">
	import { cBase, cHeader, cForm, optional } from '../../../../styles/styles.js';
	import { Modal, modalStore } from '@skeletonlabs/skeleton';
	import { selectedProject } from '../../../../stores/stores.js';
	import createDryRunMutation from '../../../../queries/create_dry_run.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import type { Project, Template, Task, Templates } from '../../../../types.js';
	import refreshProjectDetails from '../../../../lib/refresh_runs.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { displayAlert } from '../../../../utils/alerts_utils.js';

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
	const { tasks, templates, inputArtifacts, initialTaskName } = parseTaskList();
	let alertModal = false;

	function findTemplateByTaskName(taskTemplate: string) {
		if (templates) {
			return templates.find((template) => template.name === taskTemplate);
		}
	}

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
			const initialTask = tasks.find((task) => !task.dependencies);

			// extract input artifacts from initial step in the template
			const inputArtifacts: any = {};
			if (initialTask) {
				templates.forEach((template: { name: string; inputs: { artifacts: any[] } }) => {
					if (template.name === initialTask.name && template.inputs.artifacts?.[0]) {
						const artifact = template.inputs.artifacts[0];
						inputArtifacts[template.name] = {
							inputs: template.inputs,
							type: artifact.s3 ? FileUploadType.S3 : artifact.raw ? FileUploadType.Raw : undefined
						};
					}
				});
			}

			const templates1: Templates[] = templates;
			return {
				tasks,
				templates: templates1,
				inputArtifacts,
				initialTaskName: initialTask?.name || ''
			};
		}
		return { tasks: [], templates: undefined, inputArtifacts: [], initialTaskName: '' };
	}

	// modify workflow template from project to create a valid argoWorkflow input for create new dryrun
	async function newWorkflowTemplate(template: { metadata: any; spec: any }) {
		const newWorkflowTemplate = template;
		if (Object.keys(inputArtifacts).length != 0) {
			// if pipeline has initial input files
			try {
				for (const [index, artifact] of inputArtifacts[
					initialTaskName
				]?.inputs.artifacts.entries()) {
					// for input file type = raw, replace the raw contents in the workflow template
					if (inputArtifacts[initialTaskName].type == FileUploadType.Raw) {
						const files = formData.files[index] as unknown as FileList;
						if (files) {
							let text = await files[0].text();
							artifact.raw.data = `${text}`;
						} else {
							throw new Error('Initial input file is not uploaded!');
						}
					} else if (inputArtifacts[initialTaskName].type == FileUploadType.S3) {
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
			initial_task_name: initialTaskName
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
			const title = 'New dry run created&#10024;!';
			const body = `New dry run ID: ${responseCreateDryRun?.createDryRun?.id}`;
			alertModal = true;
			await displayAlert(title, body, 2000);
			await refreshProjectDetails();
		} catch (error) {
			console.log(error);
			const title = 'Error creating dry run❌!';
			const body = `${(error as Error).message}`;
			alertModal = true;
			await displayAlert(title, body, 10000);
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

			{#if tasks.length > 0}
				{#each tasks as task, i}
					<div class="ml-5">
						<p><b>{i + 1}. {task.name}</b></p>
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
						{#if task.name == initialTaskName && inputArtifacts?.[task.name]}
							<br />
							<!-- svelte-ignore a11y-label-has-associated-control -->
							{#if inputArtifacts?.[task.name]?.type == FileUploadType.Raw}
								<p>Upload Input files</p>
								{#each inputArtifacts[task.name].inputs.artifacts || [] as artifact, k}
									<!-- svelte-ignore a11y-label-has-associated-control -->
									<label>
										<span>
											{artifact.name}
											<input class="input" type="file" bind:files={formData.files[k]} />
										</span>
									</label>
									<br />
								{/each}
							{:else if inputArtifacts?.[task.name]?.type == FileUploadType.S3}
								{#each inputArtifacts[task.name].inputs.artifacts || [] as artifact}
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
						<!-- if dry run has arguments/parameters argo fields -->
						{#each tasks[i].arguments?.parameters || [] as param}
							<p>Enviroment parameters:</p>
							<label class="ml-5"
								>{param.name}:
								<span>
									<input class="input variant-form-material" type="text" bind:value={param.value} />
								</span></label
							>
						{/each}
						<!-- if dry run has env/name/value argo fields -->
						{#if templates}
							{#each findTemplateByTaskName(tasks[i].template)?.container?.env || [] as param}
								<p>Enviroment parameters:</p>
								<label class="ml-5"
									>{param.name}:
									<span>
										<input
											class="input variant-form-material"
											type="text"
											bind:value={param.value}
										/>
									</span></label
								>
							{/each}
						{/if}
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
