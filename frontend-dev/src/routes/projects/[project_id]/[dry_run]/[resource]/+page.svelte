<script lang="ts">
    import Plotly from 'plotly.js-dist';
    import { afterUpdate, onMount } from 'svelte';
    import { modeCurrent, ProgressBar } from '@skeletonlabs/skeleton';
    import type { DryRunMetrics } from '../../../../../types';
    import { get } from 'svelte/store';
    import { graphQLClient, selectedProject } from '../../../../../stores/stores';
    import getDryRunMetricsQuery from '../../../../../queries/get_dry_run_metrics.js';
    import { format } from 'date-fns';
	import { GraphQLClient } from 'graphql-request';
	import { GraphQL_API_URL } from '$lib/config.js';
	import initKeycloak from '$lib/keycloak.js';
	import { goto } from '$app/navigation';

    export let data;
    const datefmt = 'yyyy-MM-dd HH:mm:ss'

    const getDryRunMetrics = async (): Promise<DryRunMetrics[]> => {
        const variables = {
            dryRunId: data.resource
        }
        if (!$graphQLClient) {
			try {
				$graphQLClient = new GraphQLClient(GraphQL_API_URL, {});
			} catch {
				// redirect to keycloak authentication
				await initKeycloak();
			}
		}
		const response: {dryRun: { nodes: [] }} = await get(graphQLClient).request(getDryRunMetricsQuery, variables);
        return response?.dryRun?.nodes;
	};
	
    const metricsPromise = getDryRunMetrics();
    var cpuData: { x: string[]; y: number[]; type: string; name: string; }[] = [];
    var memoryData: { x: string[]; y: number[]; type: string; name: string; }[] = [];
    var networkReceiveData: { x: string[]; y: number[]; type: string; name: string; }[] = [];
    var networkTransmitData: { x: string[]; y: number[]; type: string; name: string; }[] = [];

    function addSeconds(date: Date, seconds: number) {
        date.setSeconds(date.getSeconds() + seconds);
        let dateStr = format(date, datefmt);
        return dateStr;
    }

    function timestampsToDatetime(startedAt: string, input_array: number[]) {
        let date = new Date(startedAt);
        let timeseries = [addSeconds(date, 0)];
        for (let i=0; i<(input_array.length - 1); i++) {
            let v = input_array[i+1] - input_array[i]
            let newDate = addSeconds(date, v);
            timeseries.push(newDate);
        }
        return timeseries;
    };

    function isEmpty(obj: any) {
        return Object.keys(obj).length === 0;
    }

    let logs = {};

    // TODO: move to lib or utils
	metricsPromise.then((value) => {
            value.forEach((node) => {
                // TODO: make more efficient if data missing?
                if (isEmpty(node) === false) {
                    logs[node.startedAt] = node.log[0];
                    let cpuTimestamps = timestampsToDatetime(node.startedAt, node.metrics.cpuUsageSecondsTotal.map((item) => item.timestamp))
                    let memTimestamps = timestampsToDatetime(node.startedAt, node.metrics.memoryUsageBytes.map((item) => item.timestamp))
                    let nrcTimestamps = timestampsToDatetime(node.startedAt, node.metrics.networkReceiveBytesTotal.map((item) => item.timestamp))
                    let ntrTimestamps = timestampsToDatetime(node.startedAt, node.metrics.networkTransmitBytesTotal.map((item) => item.timestamp))
                    let cpuValues = node.metrics.cpuUsageSecondsTotal.map((item) => Number(item.value))
                    let memValues = node.metrics.memoryUsageBytes.map((item) => Number(item.value))
                    let nrcValues = node.metrics.networkReceiveBytesTotal.map((item) => Number(item.value))
                    let ntrValues = node.metrics.networkTransmitBytesTotal.map((item) => Number(item.value))
                    var cpuUsage = {
                        x: cpuTimestamps,
                        y: cpuValues,
                        type: 'scatter',
                        name: node.displayName,
                    };           
                    var memoryUsage = {
                        x: memTimestamps,
                        y: memValues,
                        type: 'scatter',
                        name: node.displayName,
                    };
                    var networkReceiveBytesTotal = {
                        x: nrcTimestamps,
                        y: nrcValues,
                        type: 'scatter',
                        name: node.displayName,
                    };
                    var networkTransmitBytesTotal = {
                        x: ntrTimestamps,
                        y: ntrValues,
                        type: 'scatter',
                        name: node.displayName,
                    };
                    
                    if (cpuValues.length > 0) {
                        cpuData.push(cpuUsage);
                    } else {
                        console.log('no cpu data:')
                        console.log(cpuUsage)
                    };

                    if (memValues.length > 0) {
                        memoryData.push(memoryUsage);
                    } else {
                        console.log('no memory data:')
                        console.log(cpuUsage)
                    };

                    if (nrcValues.length > 0) {
                        networkReceiveData.push(networkReceiveBytesTotal);
                    } else {
                        console.log('no network receive data:')
                        console.log(networkReceiveBytesTotal)
                    };
                    
                    if (ntrValues.length > 0) {
                        networkTransmitData.push(networkTransmitBytesTotal);
                    } else {
                        console.log('no network transmit data:')
                        console.log(networkReceiveBytesTotal)
                    };
                }
            });
		}).catch((error) => {
            console.log(error);
		});
    

    $: textcolor = $modeCurrent === true ? '#000000' : '#ffffff';

    $: layout = {
        font: {size: 10, color:textcolor},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {title: 'xaxis title', showgrid: true, gridwidth: 1},
        yaxis: {title: 'yaxis title', showgrid: true, gridwidth: 1},
        title: "Plot title"
    };

    const noDataLayout = {
        xaxis: {"visible": false},
        yaxis: {"visible": false},
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        title: "No data",
        annotations: [
            {
                "text": "No data",
                "xref": "paper",
                "yref": "paper",
                "showarrow": false,
                "font": {
                    "size": 18
                }
            }
        ]
    }

    const config = {
        responsive: true,
        scrollZoom: true,
    }

    const drawCPUPlot = () => {
        let plot1 = document.getElementById('cpuPlot');
        layout.title = 'CPU';
        layout.xaxis.title = 'time';
        layout.yaxis.title = 'CPU usage seconds';
		let p1 = new Plotly.newPlot(plot1, {"data": cpuData, "layout": layout, "config": config});
    };

    const drawMemoryPlot = () => {
        let plot2 = document.getElementById('memoryPlot');
        layout.title = 'Memory';
        layout.xaxis.title = 'time';
        layout.yaxis.title =  'bytes';
		let p2 = new Plotly.newPlot(plot2, {"data": memoryData, "layout": layout, "config": config});
    };
    const drawNetworkReceivePlot = () => {
        let plot3 = document.getElementById('networkReceivePlot');
        layout.title = 'Network receive';
        layout.xaxis.title = 'time';
        layout.yaxis.title = 'bytes';
        if (networkReceiveData.length === 0) {
            noDataLayout.title = 'No network receive data';
            let p3 = new Plotly.newPlot(plot3, {"data": networkReceiveData, "layout": noDataLayout, "config": config});
        } else {
		    let p3 = new Plotly.newPlot(plot3, {"data": networkReceiveData, "layout": layout, "config": config});
        }
    };
    const drawNetworkTransmitPlot = () => {
        let plot4 = document.getElementById('networkTransmitPlot');
        layout.title = 'Network transmit';
        layout.xaxis.title = 'time';
        layout.yaxis.title =  'bytes';
        if (networkTransmitData.length === 0) {
            noDataLayout.title = 'No network transmit data';
            let p3 = new Plotly.newPlot(plot4, {"data": networkTransmitData, "layout": noDataLayout, "config": config});
        } else {
		    let p3 = new Plotly.newPlot(plot4, {"data": networkTransmitData, "layout": layout, "config": config});
        }
    };    

    onMount(async () => {
        await metricsPromise;
        drawCPUPlot();
        drawMemoryPlot();
        drawNetworkReceivePlot();
        drawNetworkTransmitPlot();
    });

    afterUpdate(() => {
        drawCPUPlot();
        drawMemoryPlot();
        drawNetworkReceivePlot();
        drawNetworkTransmitPlot();
    });

</script>

<!-- Page Header -->
<div class="container p-5">
    <h1><a href="/projects" >Projects</a> 
		<span STYLE="font-size:14px">/ </span>
        <button on:click={() => goto(`/projects/[project_id]/${$selectedProject?.id}`)} >{$selectedProject?.name} </button>
		<span STYLE="font-size:14px">/ </span>{data.resource}
    </h1>
	<div class="table-container p-5">
        {#await metricsPromise}
            <p>Loading metrics...</p>
            <ProgressBar />
        {:then metricsData}
            <div class="flex flex-row">
                <!-- TODO: adjust scroll https://tailwindcss.com/docs/overflow -->
                <div class="overflow-y-auto card p-10 basis-1/5">
                    <div>
                        <h1>Logs</h1>
                        <br/>
                        {#each Object.keys(logs).sort() as key}
                        <pre class="bg-surface-50-900-token ml-6 mr-6 p-3">{logs[key]}</pre>
                        <br/>
                        {/each}
                    </div>
                </div>
                <div class="card p-4 basis-2/5">
                    <div id="cpuPlot"></div>
                </div>
                <div class="card p-4 basis-2/5">
                    <div id="memoryPlot"></div>
                </div>
            </div>
            <div class="flex flex-row">
                <div class="card p-4 basis-1/2">
                    <div id="networkReceivePlot"></div>
                </div>
                <div class="card p-4 basis-1/2">
                    <div id="networkTransmitPlot"></div>
                </div>
            </div>
        {/await}
    </div>
</div>