<script lang="ts">
    // https://mermaid.js.org/intro/
    import mermaid from 'mermaid';
    import * as workflow from './hhh.json'; // for testing; import some local json file for the workflow
    import { CodeBlock, ProgressBar } from '@skeletonlabs/skeleton';
    //import jQuery from 'jquery';
	//import { bind, onMount } from 'svelte/internal';

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

    // default diagram for testing
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
            click A call callback() "Hello world"
            click B href "javascript:console.log('A callback was triggered');"
            click C call doSomething() "Do something!"
    `;

    //let element;
    let container;
    let mermaidConfig = {
        securityLevel: 'loose',
        theme: 'neutral',
        startOnLoad: true,
        logLevel: 4,
        flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
        },
        };

    mermaid.initialize(mermaidConfig);

    function changeColor(id: string, color: string) {
        console.log(`${id} color changed to ${color}`);
        buildDiagram(workflow);
        
    };

    function buildDiagram( workflow: {} ) {
        let templates = workflow.spec.templates
        let newDiagram = `
            graph ${graphOrientation}
        `;
        templates.forEach(template => {
            //console.log(element)
            //console.log("-----------------")
            template.steps?.forEach(step => {
                console.log(step)
                newDiagram += `
                    ${step.name}[${step.name}] --> `;
                step.forEach(substep => {
                    newDiagram += `${substep.name}[${substep.name}]
                    `;
                    //console.log(substep)
                    //console.log("-----------------")
                    console.log(newDiagram)
                });
            });
        });
        diagram = newDiagram;
    }

    const renderDiagram = async () => {
        const {svg} = await mermaid.render('mermaid', diagram, container);
        container.innerHTML=svg;
        container.addEventListener('click', function (e) {
            if (e.target.attributes.getNamedItem('class').value === 'nodeLabel') {
                changeColor(e.target.innerHTML, colors.finished)
            };
        });
        //console.log(container)
        // mermaid.render('mermaid', diagram).then(({ svg, bindFunctions }) => {
        //     container.innerHTML = svg;
        //     bindFunctions?.(container);
        //     });  
    };

    $: diagram && renderDiagram()

</script>

<div class="container p-5">
    {#await renderDiagram}
        <p style="font-size:20px;">Loading...</p>
        <ProgressBar />
    {:then diagram}
        <span class="mermaid" bind:this={container}></span>
        <div class="code">
            <CodeBlock language='json' code={JSON.stringify(workflow, null, 2)} text="text-xs" />
        </div>
    {/await}
</div>
