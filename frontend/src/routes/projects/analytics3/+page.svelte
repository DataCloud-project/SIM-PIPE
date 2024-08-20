<script lang="ts">
	import { onMount } from 'svelte';
	import DAG from './dag.svelte';
	import Plot from './plot.svelte';
    import { requestGraphQLClient } from '$lib/graphqlUtils';    
    import { getWorkflowTemplate } from '$lib/getWorkflowTemplate';
    import getScalingLawsFromNodesMetricsQuery from '$queries/get_scaling_laws_from_nodes_metrics';
    import { extractNodesAndLinks2 } from './helpers';
    import type { Node, Link } from './helpers';
    import type { AggregatedNodesMetrics } from '$typesdefinitions';

    const workflowName = 'rpm';
	let nodes: Node[] = [];
	let links: Link[] = [];
    const dataX = [10, 25, 36];  // TODO: temporary data - to be replaced with fileSize as default.
    const regressionMethod = 'power';
    let nodesMetrics: AggregatedNodesMetrics[] = [];
    const dryRunIds = ["health-data-pipeline-mszt2", "health-data-pipeline-7qtwj", "health-data-pipeline-rl282"];

    let nodesMetricsLoaded = false;
    let pageWidthUpdated = false;

	let container: HTMLDivElement;
	let pageWidth = 0; // default value to be updated onMount and onResize
	const dagHeight = 300;
	const plotHeight = 150;
	let numberOfNodes = nodes.length;
	let nodeColWidth = Math.max(...nodes.map((node) => node.label.length)) * 10;
	let tableColWidth = (pageWidth - nodeColWidth) / 3;
	let tableMetricsHeight = numberOfNodes * plotHeight + 50;

	const updatepageWidth = (): void => {
		if (container) {
			pageWidth = container.getBoundingClientRect().width;
            numberOfNodes = nodes.length;
            nodeColWidth = Math.max(...nodes.map((node) => node.label.length)) * 10;
			tableColWidth = (pageWidth - nodeColWidth) / 3;
            tableMetricsHeight = numberOfNodes * plotHeight + 50
			pageWidthUpdated = true;
		}
	};

    async function getAggregatedNodesMetrics(dryRunIds: string[], dataX: number[], regressionMethod: string): Promise<AggregatedNodesMetrics[]> {
        const variables = { dryRunIds, dataX, regressionMethod };
        const response = await requestGraphQLClient(getScalingLawsFromNodesMetricsQuery, variables);
        // console.log('response', response);
        return response.computeScalingLawsFromNodesMetrics;
    }

	onMount(async (): Promise<void> => {

        // TODO: continue here!
        const workflow = await getWorkflowTemplate(workflowName);
        console.log('workflow', workflow.workflowTemplate);
		({ nodes, links } = extractNodesAndLinks2(workflow.workflowTemplate));
        // console.log('nodes', nodes);
        // console.log('links', links);

        updatepageWidth();

        nodesMetrics = await getAggregatedNodesMetrics(dryRunIds, dataX, regressionMethod);
        nodesMetricsLoaded = true;

		window.addEventListener('resize', updatepageWidth);

		return (): void => {
			window.removeEventListener('resize', updatepageWidth);
		};
	});

	$: if (pageWidthUpdated) {
		// This will trigger reactivity and re-render the DAG component
		pageWidthUpdated = false;
		console.log('pageWidthUpdated', pageWidth);
	}
    $: if (nodesMetricsLoaded) {
        console.log('nodesMetrics', nodesMetrics);
    }

</script>

<div bind:this={container} class="container">
	<div class="heading">
		<h1>Analytics</h1>
		<p>{workflowName}</p>
	</div>
	<div class="dag-container" style="height:{dagHeight}px">
		{#if pageWidth > 0}
			<div class="dag-container-container">
				<DAG {nodes} {links} width={pageWidth} height={dagHeight} />
			</div>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
	<div class="metrics-container" style="height:{tableMetricsHeight}px">
		{#if nodesMetricsLoaded}
			<table style="width: 100%;">
				<thead>
					<tr>
						<th style="width: {nodeColWidth}px;">Node</th>
						<th style="width: calc((100% - {nodeColWidth}px) / 3);">Duration [time/units?]</th>
						<th style="width: calc((100% - {nodeColWidth}px) / 3);">Memory [units?]</th>
						<th style="width: calc((100% - {nodeColWidth}px) / 3);">CPU [cpu seconds/units?]</th>
					</tr>
				</thead>
				<tbody>
					{#each nodesMetrics as node}
						<tr>
							<td style="padding:7px">{node.nodeName}</td>
							<td><Plot height={plotHeight} width={tableColWidth} 
                                xData={dataX} yData={node.data.duration} labels={node.data.nodeId}
                                coeffs={node.duration.coeffs} regressionMethod={regressionMethod}
                                ></Plot></td>
							<td><Plot height={plotHeight} width={tableColWidth} 
                                xData={dataX} yData={node.data.mem} labels={node.data.nodeId}
                                coeffs={node.mem.coeffs} regressionMethod={regressionMethod}
                                ></Plot></td>
							<td><Plot height={plotHeight} width={tableColWidth} 
                                xData={dataX} yData={node.data.cpu} labels={node.data.nodeId}
                                coeffs={node.cpu.coeffs} regressionMethod={regressionMethod}
                                ></Plot></td>
						</tr>
					{/each}
				</tbody>
			</table>
		{:else}
			<p>Loading...</p>
		{/if}
	</div>
</div>

<style>
	.container {
		display: flex;
		width: 100%;
		flex-direction: column;
		padding: 10px;
	}
	.heading {
		margin-bottom: 10px;
	}
	.dag-container {
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid white;
		margin-bottom: 10px;
	}
	.dag-container-container {
		display: flex;
		justify-content: center;
		align-items: center;
	}
	.metrics-container {
		width: 100%;
		border: 1px solid white;
	}
</style>
