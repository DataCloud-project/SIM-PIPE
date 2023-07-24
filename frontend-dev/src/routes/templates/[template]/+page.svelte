<script lang="ts">
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import { get } from 'svelte/store';
    import { graphQLClient, clickedProjectId } from '../../../stores/stores';
    import getWorkflowQuery from '../../../queries/get_workflow_template';
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import YAML from 'json-to-pretty-yaml';
	import initKeycloak from '$lib/keycloak.js';
	import { GraphQL_API_URL } from '$lib/config.js';
	import { GraphQLClient } from 'graphql-request';
	import { goto } from '$app/navigation';

    export let data;

    $: language = 'yaml';

    const getWorkflowTemplate = async (): Promise<{}> => {
        const variables = {
            name: data.template,
        }
        if (!$graphQLClient) {
			try {
				$graphQLClient = new GraphQLClient(GraphQL_API_URL, {});
			} catch {
				// redirect to keycloak authentication
				await initKeycloak();
			}
		}
		const response: {} = await get(graphQLClient).request(getWorkflowQuery, variables);
		return response;
	};
	
    const workflowPromise = getWorkflowTemplate();
    var workflow = {};

    workflowPromise.then((data) => {
        workflow = data;
    }).catch((error) => {
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
    <h1><a href="/projects" >Projects</a> 
		<span STYLE="font-size:14px">/ </span>{data.template}
		<!-- <span STYLE="font-size:14px">/ </span> -->
    </h1>
    <br/>
    <h1>
        <!-- TODO: adjust position and style -->
        <button class="btn variant-filled" on:click={() => goto(`/projects/[project_id]/${$clickedProjectId}`)} >
            Dry Runs ->
        </button>
    </h1>
	<div class="table-container p-5">
    {#await workflowPromise}
        <ProgressBar />
    {:then workflow}
        <div class="flex justify-end">
            <button type="button" class="btn btn-sm variant-filled" on:click={switchLanguage}>
                <span>Switch to {language === 'yaml' ? 'JSON' : 'YAML'}</span>
            </button>
        </div>
        <br/>
        <div class="code overflow-y-auto h-96">
            {#if language === 'json'}
                <CodeBlock language={language} code={JSON.stringify(workflow, null, 2)} text="text-xs" />
            {:else if language === 'yaml'}
                <CodeBlock language={language} code={YAML.stringify(workflow, null, 2)} text="text-xs" />
            {/if}
        </div>
    {/await}
</div>
</div>
