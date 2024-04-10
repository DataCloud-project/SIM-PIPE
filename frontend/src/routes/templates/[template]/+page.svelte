<script lang="ts">
	import { ProgressBar, CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import { onMount } from 'svelte';
	import { clickedProjectId } from '$stores/stores';
	import getWorkflowQuery from '$queries/get_workflow_template';
	import getWorkflowFromDryRunQuery from '$queries/get_workflow_template_from_dry_run';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import type { WorkflowTemplate, WorkflowTemplateFromDryRun } from '$typesdefinitions';

	export let data;
	let workflow = {};
	let requestsComplete = false;

	$: language = 'yaml'; // default format of workflow template

	function switchLanguage(): void {
		language = language === 'yaml' ? 'json' : 'yaml';
	}

	const getWorkflowTemplate = async (): Promise<{ workflowTemplate: WorkflowTemplate }> => {
		const variables = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
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
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
			dryRunId: data.template
		};
		const response = await requestGraphQLClient<WorkflowTemplateFromDryRun>(
			getWorkflowFromDryRunQuery,
			variables
		);
		// console.log(response);
		return response;
	};

	onMount(async () => {
		try {
			const data = await getWorkflowTemplate();
			workflow = data.workflowTemplate;
			// workflowName = data.workflowTemplate.name;
			// project = data.workflowTemplate.project;
			requestsComplete = true;
		} catch (error) {
			console.log('failed to fetch workflow template data from project:', error);
			try {
				const data = await getWorkflowTemplateFromDryRun();
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				workflow = data.dryRun.argoWorkflow;
				// workflow_name = data.dryRun.id;
				// project = data.dryRun.project;
				requestsComplete = true;
			} catch (error) {
				console.log('failed to fetch workflow template data from dry run:', error);
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
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
				<!-- eslint-disable-next-line @typescript-eslint/no-unsafe-member-access -->
				/ templates / {data.template}
			</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={switchLanguage}>
						<span>Switch to {language === 'yaml' ? 'JSON' : 'YAML'}</span>
					</button>
				</div>
				<div>
					<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
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
					<!-- eslint-disable-next-line unicorn/no-null -->
					<CodeBlock {language} code={JSON.stringify(workflow, null, 2)} text="text-xs" />
				{:else if language === 'yaml'}
					<!-- eslint-disable-next-line unicorn/no-null -->
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
