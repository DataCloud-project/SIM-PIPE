<script lang="ts">
	import { ProgressBar, CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import { onMount } from 'svelte';
	import { clickedProjectId } from '$stores/stores';
	import { getWorkflowTemplate, getWorkflowTemplateFromDryRun } from '$lib/getWorkflowTemplate';
	import { goto } from '$app/navigation';

	export let data;
	let workflow = {};
	let requestsComplete = false;
	const templateName = data.template;

	$: language = 'yaml'; // default format of workflow template

	function switchLanguage(): void {
		language = language === 'yaml' ? 'json' : 'yaml';
	}

	onMount(async () => {
		try {
			const response = await getWorkflowTemplate(templateName);
			workflow = response.workflowTemplate;
			// workflowName = data.workflowTemplate.name;
			// project = data.workflowTemplate.project;
			requestsComplete = true;
		} catch (error) {
			console.log('failed to fetch workflow template data from project:', error);
			try {
				const response = await getWorkflowTemplateFromDryRun(templateName);
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
				console.log('getWorkflowTemplateFromDryRun', response);
				workflow = response.dryRun.argoWorkflow;
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
