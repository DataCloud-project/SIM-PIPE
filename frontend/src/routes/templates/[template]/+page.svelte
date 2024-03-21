<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { clickedProjectId } from '$stores/stores';
	import getWorkflowQuery from '$queries/get_workflow_template';
	import getWorkflowFromDryRunQuery from '$queries/get_workflow_template_from_dry_run';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import type { WorkflowTemplate, WorkflowTemplateFromDryRun, Project } from '$typesdefinitions';
	import { onMount } from 'svelte';

	export let data;
	let requestsComplete = false;

	$: language = 'yaml'; // default format of workflow template

	const getWorkflowTemplate = async (): Promise<{ workflowTemplate: WorkflowTemplate }> => {
		const variables = {
			name: data.template
		};
		const response = await requestGraphQLClient<{ workflowTemplate: WorkflowTemplate }>(
			getWorkflowQuery,
			variables
		);
		// console.log(response);
		return response;
	};

	const getWorkflowTemplateFromDryRun = async (): Promise<WorkflowTemplateFromDryRun> => {
		const variables = {
			dryRunId: data.template
		};
		const response = await requestGraphQLClient<WorkflowTemplateFromDryRun>(
			getWorkflowFromDryRunQuery,
			variables
		);
		// console.log(response);
		return response;
	};

	let workflow = {};
	let workflow_name: string;
	let project: Project;

	function switchLanguage() {
		if (language === 'yaml') {
			language = 'json';
		} else {
			language = 'yaml';
		}
	}

	onMount(async () => {
		try {
			let data = await getWorkflowTemplate();
			workflow = data.workflowTemplate;
			workflow_name = data.workflowTemplate.name;
			project = data.workflowTemplate.project;
			requestsComplete = true;
		} catch (error) {
			console.log('failed to fetch workflow template data from project: ', error);
			try {
				let data = await getWorkflowTemplateFromDryRun();
				workflow = data.dryRun.argoWorkflow
				workflow_name = data.dryRun.id;
				project = data.dryRun.project;
				requestsComplete = true;
			} catch (error) {
				console.log('failed to fetch workflow template data from dry run: ', error);
				goto('/404');
			}
		}
	});
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#if !requestsComplete}
			<p style="font-size:20px;">Loading...</p>
			<ProgressBar />
		{:else}
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
						on:click={() => goto(`/projects/dryruns/${$clickedProjectId}`)}
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
		{/if}
	</div>
</div>

<style>
	.code {
		max-height: 80vh;
	}
</style>
