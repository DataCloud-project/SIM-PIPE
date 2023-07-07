<script lang="ts">
	import { cBase, cHeader, cForm } from '../../../../styles/styles.js';
	import { modalStore } from '@skeletonlabs/skeleton';
	import { selectedProject, graphQLClient } from '../../../../stores/stores.js';
	import createDryRunMutation from '../../../../queries/create_dry_run.js';
	import createWorkflowTemplateMutation from '../../../../queries/create_workflow_template.js';

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

	async function onCreateDryRunSubmit(): Promise<void> {
		// TODO: work in progress
		modalStore.close();
		const newName = (Math.random() + 1).toString(36).substring(7);
		// create a new workflow template with the updated env values

		const variables1 = {
			input: {
				argoWorkflowTemplate: $selectedProject?.workflowTemplates[0].argoWorkflowTemplate,
				name: newName,
				projectId: $selectedProject?.id
			}
		};
		const newWorkflowTemplateResponse = await $graphQLClient.request(
			createWorkflowTemplateMutation,
			variables1
		);
		// create a new argoworkflowtemplate with the updated env values
		const newDryRun = {
			metadata: {
				generateName: $selectedProject?.name
			},
			spec: {
				workflowTemplateRef: {
					name: newName
				},
				entrypoint: $selectedProject?.workflowTemplates[0].argoWorkflowTemplate.metadata.enr
			}
		};
		const variables = {
			input: {
				projectId: $selectedProject?.id,
				argoWorkflow: newDryRun
			}
		};
		const responseCreateDryRun = await $graphQLClient.request(createDryRunMutation, variables);
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
