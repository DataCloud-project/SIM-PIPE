<script lang="ts">
	import { CodeBlock, ProgressBar } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { ArrowRightIcon } from 'svelte-feather-icons';

	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphql-utils';

	import getWorkflowQuery from '../../../queries/get-workflow-template';
	import { clickedProjectId } from '../../../stores/stores';
	import type { WorkflowTemplate } from '../../../types';

	$: language = 'yaml';



	const getWorkflowTemplate = async (): Promise<WorkflowTemplate> => {
	};

	const workflowPromise = getWorkflowTemplate();
	var workflow = {};

	workflowPromise
		.then((data) => {
			workflow = data;
		})
		.catch((error) => {
			console.log(error);
		});

	function switchLanguage() {
		language = language === 'yaml' ? 'json' : 'yaml';
	}

	export let data;
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
