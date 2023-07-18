<script lang="ts">
    // https://mermaid.js.org/intro/
    import mermaid from 'mermaid';
    import * as workflow from './hhh.json';
    //import jQuery from 'jquery';
    import { CodeBlock, ProgressBar } from '@skeletonlabs/skeleton';

    let graphOrientation = 'LR';
    let servers = {
        "server1": "myserver",
        "server2": "Server02",
        "server3": "Server03",
    }
    let colors = {
        "finished": "#50C878",
        "running": "#00FFFF",
        "failed": "#880808",
    }

    async function buildDiagram(workflow: {}) {
        let templates = workflow.spec.templates
        console.log(templates);
        //return diagram;
    }

    buildDiagram(workflow);

    // The default diagram
    let diagram = `
        graph ${graphOrientation}
            A[Client] --> B[Load Balancer]
            B --> C[${servers.server1}]
            B --> D[Server02]
            B --> E[Server03]
            C --> B
            D --> B
            E --> B
            style A fill:${colors.running}
            style B fill:${colors.failed}
            style E fill:${colors.finished}  
            click A call callback()
            click B href "projects"
    `;

    let element;
    let container;

    mermaid.initialize({
        securityLevel: 'loose',
        theme: 'neutral',
        startOnLoad: true,
        logLevel: 4,
        });

    const callback = function () {
        alert('A callback was triggered');
    };        

    const renderDiagram = async () => {
        element = document.querySelector('#mermaid');
        const {svg, bindFunctions} = await mermaid.render('mermaid', diagram)
        container.innerHTML=svg;
        if (bindFunctions) {
            bindFunctions(element);
        }        
    };

    $: diagram && renderDiagram()
</script>

<div class="container p-5">
    {#await renderDiagram}
        <p style="font-size:20px;">Loading projects...</p>
        <ProgressBar />
    {:then diagram}
        <span bind:this={container}></span>
        <div class="code">
            <CodeBlock language='json' code={JSON.stringify(workflow, null, 2)} text="text-xs" />
        </div>
    {/await}
</div>
