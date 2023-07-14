<script lang="ts">
    import { ProgressBar } from '@skeletonlabs/skeleton';
    import { get } from 'svelte/store';
    import { graphQLClient } from '../../../stores/stores';
    import getWorkflowQuery from '../../../queries/get_workflow_template';
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import YAML from 'json-to-pretty-yaml';

    const workflowtemplatename = 'helloworld';
    $: language = 'yaml';

    const getWorkflowTemplate = async (): Promise<{}> => {
        const variables = {
            name: workflowtemplatename,
        }
		const response: {} = await get(graphQLClient).request(getWorkflowQuery, variables);
        //console.log(response);
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

<!-- Page Header -->
<div class="container p-5">
    <h1>DAG</h1>
    {#await workflowPromise}
        <ProgressBar />
    {:then workflow}
        <div class="flex justify-end">
            <button type="button" class="btn btn-sm variant-filled" on:click={switchLanguage}>
                <span>Switch to {language === 'yaml' ? 'JSON' : 'YAML'}</span>
            </button>
        </div>
        <div class="code">
            {#if language === 'json'}
                <CodeBlock language={language} code={JSON.stringify(workflow, null, 2)} text="text-xs" />
            {:else if language === 'yaml'}
                <CodeBlock language={language} code={YAML.stringify(workflow, null, 2)} text="text-xs" />
            {/if}
        </div>
    {/await}
</div>
