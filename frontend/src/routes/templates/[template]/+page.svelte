<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { clickedProjectId } from '../../../stores/stores';
	import getWorkflowQuery from '../../../queries/get_workflow_template';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import type { Project, WorkflowTemplate } from '../../../types.d.ts'

	export let data;

	$: language = 'yaml'; // default format of workflow template

	const getWorkflowTemplate = async (): Promise<{workflowTemplate: WorkflowTemplate}> => {
		const variables = {
			name: data.template
		};
		const response = await requestGraphQLClient<{workflowTemplate: WorkflowTemplate}>(getWorkflowQuery, variables);
		console.log(response);
		return response;
	};

	const workflowPromise = getWorkflowTemplate();
	var workflow = {};
	var workflow_name: string;
	var project: Project;

	workflowPromise
		.then((data) => {
			workflow = data.workflowTemplate;
			workflow_name = data.workflowTemplate.name
			project = data.workflowTemplate.project
			//console.log(project)
			//console.log(workflow_name)
		})
		.catch((error) => {
			console.log(error);
		});

	function switchLanguage() {
		if (language === 'yaml') {
			language = 'json';
		} else {
			language = 'yaml';
		}
	}
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await workflowPromise}
			<p style="font-size:20px;">Loading...</p>
			<ProgressBar />
		{:then workflow}
			<h1>
				<a href="/projects">Projects</a>
				/ templates / {data.template}
			</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={switchLanguage}>
						<span>Switch to {language === 'yaml' ? 'JSON' : 'YAML'}</span>
					</button>
				</div>
				<div>
					<button
						type="button"
						class="btn btn-sm variant-filled"
						on:click={() => goto(`/projects/project_id/${$clickedProjectId}`)}
					>
						Go to dry runs <ArrowRightIcon size="1x" />
					</button>
				</div>
			</div>
			<div class="code overflow-y-scroll">
				{#if language === 'json'}
					<CodeBlock {language} code={JSON.stringify(workflow, null, 2)} text="text-xs" />
				{:else if language === 'yaml'}
					<CodeBlock {language} code={YAML.stringify(workflow, null, 2)} text="text-xs" />
				{/if}
			</div>
		{/await}
	</div>
</div>

<style>
	.code {
		max-height: 80vh;
	}
</style>
