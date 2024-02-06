<script lang="ts">
	import { Modal, ProgressBar } from '@skeletonlabs/skeleton';
	import { clickedProjectId } from '../../../stores/stores';
	import getWorkflowQuery from '../../../queries/get_workflow_template';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import YAML from 'json-to-pretty-yaml';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { ArrowRightIcon } from 'svelte-feather-icons';
	import { displayAlert } from '../../../utils/alerts_utils';

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
		.catch(async (error) => {
			const title = 'Error displaying workflow template❌!';
			const body = `${(error as Error).message}`;
			await displayAlert(title, body, 10000);
			goto('/projects/');
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
		{/await}
	</div>
</div>

<Modal />

<style>
	.code {
		max-height: 80vh;
	}
</style>
