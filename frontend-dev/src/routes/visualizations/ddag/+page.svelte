<script lang="ts">
    // https://mermaid.js.org/intro/
    import mermaid from 'mermaid';
    //import * as workflow from './hhh.json'; // for testing; import some local json file for the workflow
    import { CodeBlock, ProgressBar } from '@skeletonlabs/skeleton';
	import { GraphQL_API_URL } from '$lib/config.js';
	import { graphQLClient } from '../../../stores/stores';
    import { get } from 'svelte/store';
    import initKeycloak from '$lib/keycloak.js';
	import { GraphQLClient } from 'graphql-request';
    import getWorkflowQuery from '../../../queries/get_workflow_template';
    import getDryRunPhaseResultsQuery from '../../../queries/get_dry_run_phase_results';
    

    const template_name = "diamondsimple";

    const dryrun_name = "dag-diamond-hx2kr"


    const getData = async (): Promise<{}> => {
        const workflow_variables = {
            name: template_name,
        }
        const dryrun_variables = {
            dryRunId: dryrun_name,
        }
        if (!$graphQLClient) {
			try {
				$graphQLClient = new GraphQLClient(GraphQL_API_URL, {});
			} catch {
				// redirect to keycloak authentication
				await initKeycloak();
			}
		}
		const workflow_response: {} = await get(graphQLClient).request(getWorkflowQuery, workflow_variables);
        const dryrun_response: {} = await get(graphQLClient).request(getDryRunPhaseResultsQuery, dryrun_variables);
        const responses = {
            workflow: workflow_response,
            dryrun: dryrun_response,
        }
        return responses;
	};

    const Promise = getData();
    $: workflow = {};
    $: dryrun_results = {};    

    Promise.then((data) => {
        workflow = data.workflow;
        dryrun_results = data.dryrun;
        buildDiagram();
        renderDiagram();
    }).catch((error) => {
        console.log(error);
    });

    let graphOrientation = 'LR';

    let colors = {
        "Succeeded": "#34d399",
        "Running": "#6ee7b7",
        "Failed": "#ef4444",
        "Error": "#b91c1c",
        "Pending": "#f1f5f9",
        "Skipped": "#e2e8f0",
        "Omitted": "#cbd5e1",
        "Unknown": "#f9fafb",
    }

    // default diagram for testing
    $: diagram = `
        graph ${graphOrientation}
            A[Client]
            B[Load Balancer]
            C[Server01]
            D[Server02]
            E[Server03]
            F[File Storage 1]
            G[File Storage 2 - Backup]
            H[File Storage 3 - Backup]
            A --> B
            B <--> C
            B <--> D
            B <--> E
            C --> F
            D --> F
            E --> F
            F --> G
            G --> H
            style A fill:${colors.Succeeded}
            style B fill:${colors.Failed}
            style C fill:${colors.Running}
            style D fill:${colors.Skipped}
            style E fill:${colors.Omitted}
            style F fill:${colors.Error}
            style G fill:${colors.Unknown}
            click A call callback() "Hello world"
            click B href "javascript:console.log('A callback was triggered');"
            click C call doSomething() "Do something!"
    `;
    let mermaidCode = [];

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
    };

    function generateRandomString(length: number) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }    

    function argoStepsToMermaid(argoWorkflow) {
        //const mermaidCode = [];
        let previousStep = "";
        let previousStepLength = 0;
        for (const stepList of argoWorkflow) {

            for (const parallellStep of stepList) {
                const stepName = parallellStep.name;
                mermaidCode.push(`  ${stepName}["${stepName}"];`);
                mermaidCode.push(`  click ${stepName} href "javascript:console.log('task ${stepName}');"`)
            }
            if (previousStep !== "") {
                if (stepList.length > 1) {
                    let subraphName = generateRandomString(5);
                    mermaidCode.push(`  subgraph ${subraphName}`);
                    for (const step of stepList) {
                        const stepName = step.name;
                        mermaidCode.push(`    ${stepName};`);
                    };
                    mermaidCode.push(`  end`);
                    mermaidCode.push(`  ${previousStep} --> ${subraphName};`);
                    previousStep = subraphName;
                }
                else {
                    for (const step of stepList) {
                        const stepName = step.name;
                        if (previousStep !== "") {
                            mermaidCode.push(`    ${previousStep} --> ${stepName};`);
                        };
                        previousStep = stepName;
                    };              
                };
            }
            else {
                const stepName = stepList[0].name;
                previousStep = stepName;
            }
        };
    }

    function argoDAGtoMermaid(argoWorkflow) {
        argoWorkflow.tasks.forEach((task) => {
            //console.log(task);
            const taskName = task.name;
            const dependencies = task.dependencies || [];
            const depends = task.depends || "";

            mermaidCode.push(`  ${taskName}["${taskName}"];`);
            mermaidCode.push(`  click ${taskName} href "javascript:console.log('task ${taskName}');"`)
            
            for (const depTask of dependencies) {
                mermaidCode.push(`  ${depTask} --> ${taskName};`);
            };
            if (depends) {
                //dep_list = depends.split(" ");
                depends.split(" ").forEach((dep) => {
                    //console.log(dep);
                    if (!["&&", "||", "!"].includes(dep)) {
                        mermaidCode.push(`  ${dep} --> ${taskName};`);
                    }
                    else {
                        //console.log(dep);
                    };
                });
            };
      });
    };

    function buildDiagram () {
        mermaidCode = []; // clear mermaidCode
        let node0 = dryrun_results.dryRun.nodes[0];
        let dryrun_name = node0.displayName;
        mermaidCode.push(`---\ntitle: ${dryrun_name}\n---`);
        mermaidCode.push(`graph ${graphOrientation};`);
        //workflow.spec.templates.forEach((template) => {
        workflow.workflowTemplate.argoWorkflowTemplate.spec.templates.forEach((template) => {
            try {
                argoStepsToMermaid(template.steps)
            }
            catch (error) {
                console.log(error)
            };
            try {
                argoDAGtoMermaid(template.dag)
            }
            catch (error) {
                console.log(error)
            };
        });
        diagram = mermaidCode.join("\n");
        console.log(diagram);
    }

    const renderDiagram = async () => {
        const {svg} = await mermaid.render('mermaid', diagram, container);
        container.innerHTML=svg;
        //console.log(workflow.workflowTemplate.argoWorkflowTemplate.spec.templates)
        container.addEventListener('click', function (e) {
            if (e.target.attributes.getNamedItem('class').value === 'nodeLabel') {
                console.log("hello world");
                buildDiagram();
                console.log(diagram);
            };
        });
        //console.log(container)
        // mermaid.render('mermaid', diagram).then(({ svg, bindFunctions }) => {
        //     container.innerHTML = svg;
        //     bindFunctions?.(container);
        //     });
    };

</script>

<div class="container p-5">
    {#await Promise}
        <p style="font-size:20px;">Loading...</p>
            <ProgressBar />    
    {:then}
        <span class="mermaid">
            <div class="flex justify-center" bind:this={container}></div>
        </span>
        <div class="code">
            <CodeBlock language='json' code={JSON.stringify(workflow, null, 2)} text="text-xs" />
        </div>
    {/await}
</div>
