<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { clickedProjectId } from '../../../stores/stores';
	import getWorkflowQuery from '../../../queries/get_workflow_template';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { ArrowRightIcon } from 'svelte-feather-icons'

	export let data;

	$: language = 'yaml';

	const getWorkflowTemplate = async (): Promise<any> => {
		const variables = {
			name: data.template
		};
		const response = await requestGraphQLClient(getWorkflowQuery, variables);
		return response;
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
		if (language === 'yaml') {
			language = 'json';
		} else {
			language = 'yaml';
		}
	}
</script>

<div class="container p-5">
	<h1>
		<a href="/projects">Projects</a>
		<span STYLE="font-size:14px">/ </span>{data.template}
	</h1>
	<div class="table-container p-5">
		{#await workflowPromise}
			<p style="font-size:20px;">Loading...</p>
			<ProgressBar />
		{:then workflow}
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={switchLanguage}>
						<span>Switch to {language === 'yaml' ? 'JSON' : 'YAML'}</span>
					</button>
				</div>
				<div>
					<button type="button" class="btn btn-sm variant-filled"
						on:click={() => goto(`/projects/[project_id]/${$clickedProjectId}`)}>
						Go to dry runs <ArrowRightIcon size="1x"/>
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
