<script lang="ts">
    import Plotly from 'plotly.js-dist';
    import { afterUpdate, onMount } from 'svelte';
    import { modeCurrent } from '@skeletonlabs/skeleton';
    import type { DryRunMetrics } from '../../types';
    import { get } from 'svelte/store';
    import { graphQLClient } from '../../stores/stores';
    import getDryRunMetricsQuery from '../../queries/get_dry_run_metrics.js';

    const dryRunName = 'forever-7mchz'

    const getDryRunMetrics = async (): Promise<DryRunMetrics[]> => {
        const variables = {
            dryRunId: dryRunName
        }
		const response: {metrics: DryRunMetrics[]} = await get(graphQLClient).request(getDryRunMetricsQuery, variables);
        console.log(response.dryRun.nodes)
		return response.dryRun.nodes;
	};
	
    const metricsPromise = getDryRunMetrics();
    let metricsData = [];

    // TODO: move to lib or utils
	metricsPromise.then((value) => {
            metricsData = value;
		}).catch(() => {
		    console.log(metricsPromise)
		});

    var trace1 = {
        x: [1, 2, 3, 4],
        y: [10, 15, 13, 17],
        type: 'scatter',
        name: "Name 1"
    };

    var trace2 = {
        x: [1, 2, 3, 4],
        y: [16, 5, 11, 9],
        type: 'scatter',
        name: "Name 2"
    };

    var data = [trace1, trace2];
    
    $: textcolor = $modeCurrent === true ? '#000000' : '#ffffff';

    $: layout = {
        font: {size: 10, color:textcolor},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {title: 'xaxis title', showgrid: true, gridwidth: 1},
        yaxis: {title: 'yaxis title', showgrid: true, gridwidth: 1},
    };

    var config = {
        responsive: true,
        scrollZoom: true,
    }

    const drawPlot1 = () => {
        let plot1 = document.getElementById('plot1');
        layout.xaxis.title = 'time (s)';
        layout.yaxis.title = 'CPU';
		let p1 = new Plotly.newPlot(plot1, {"data": data, "layout": layout, "config": config});
    };

    const drawPlot2 = () => {
        let plot2 = document.getElementById('plot2');
        layout.xaxis.title = 'time (s)';
        layout.yaxis.title =  'Memory';
		let p2 = new Plotly.newPlot(plot2, {"data": [trace2], "layout": layout, "config": config});
    };    

    onMount(async () => {
        drawPlot1();
        drawPlot2();
    });

    afterUpdate(() => {
        drawPlot1();
        drawPlot2();
        console.log(`changed plot textcolor to ${textcolor}`)
    });

</script>

<!-- Page Header -->
<div class="container">
	<h1>Visualizations</h1>
    <div class="placeholder">
        <p> Here we can place the DAG </p>
    </div>
    <div class="flex flex-row">
        <div class="card p-4 basis-1/2">
            <div id="plot1"></div>
        </div>
        <div class="card p-4 basis-1/2">
            <div id="plot2"></div>
        </div>
    </div>
    <div>{JSON.stringify(metricsData)}</div>
</div>