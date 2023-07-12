<script lang="ts">
	import { cBase, cHeader, cForm } from '../../../../styles/styles.js';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { selectedProject, graphQLClient } from '../../../../stores/stores.js';
	import createDryRunMutation from '../../../../queries/create_dry_run.js';
	import allDryRunsQuery from '../../../../queries/get_all_dryruns.js';
	import type { Project } from '../../../../types.js';
	import refreshProjectDetails from  '../../../../lib/refresh_runs.js';

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

	let formData = {
		name: '',
		files: undefined,
		dagTemplate: {}
	};
	let newParams: { taskName: string; parameters: Parameters }[] = [];

	function parseTaskList() {
		const {
			spec: { templates }
		} = $selectedProject?.workflowTemplates[0].argoWorkflowTemplate;
		formData.dagTemplate = templates.find((template: { dag: any }) => template.dag);
		const tasks: Task[] = formData.dagTemplate ? formData.dagTemplate.dag.tasks : [];

		tasks.forEach((task) => {
			// variable to store the new environment parameters entered by the user
			newParams.push({
				taskName: task.name,
				parameters: task.arguments.parameters
			});
		});
		return tasks;
	}
	const taskList = parseTaskList();

	// modify workflow template from project to create a valid argoWorkflow input for create new dryrun
	function newWorkflowTemplate(template: { metadata: any; spec: any }) {
		const newWorkflowTemplate = template;
		newWorkflowTemplate.metadata =
			formData.name == ''
				? { generateName: newWorkflowTemplate.metadata.generateName }
				: { name: formData.name };
		return newWorkflowTemplate;
	}

	async function onCreateDryRunSubmit(): Promise<void> {
		modalStore.close();

		const variables = {
			input: {
				projectId: $selectedProject?.id,
				argoWorkflow: newWorkflowTemplate(
					$selectedProject?.workflowTemplates[0].argoWorkflowTemplate
				)
			}
		};
		const responseCreateDryRun = await $graphQLClient.request(createDryRunMutation, variables);
		// refresh dry runs list
		const response: { project: Project } = await $graphQLClient.request(allDryRunsQuery, {
			projectId: $selectedProject?.id
		});
		$selectedProject = response.project;
		refreshProjectDetails();
	}
</script>

{#if $modalStore[0]}
	<div class="modal-example-form {cBase}">
		<header class={cHeader}>{$modalStore[0].title ?? '(title missing)'}</header>
		<article>{$modalStore[0].body ?? '(body missing)'}</article>
		<form class="modal-form {cForm}">
			<label class="label">
				<span>Dry run name</span>
				<input class="input" type="text" bind:value={formData.name} placeholder="Enter name..." />
			</label>
			<!-- TODO: Fill the rest -->
			<label class="label">
				<span>Upload input files for the dry run</span>
				<input class="input" multiple type="file" bind:files={formData.files} />
			</label>

			{#if taskList.length > 0}
				{#each taskList as task, i}
					<div class="ml-5">
						<label><b>{task.name}</b></label>
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
						{#each taskList[i].arguments.parameters as param, j}
							<label>Enviroment parameters:</label>
							<label
								>{param.name}:
								<span>
									<input type="text" bind:value={taskList[i].arguments.parameters[j].value} />
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
