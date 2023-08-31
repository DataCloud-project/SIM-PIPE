<script lang='ts'>
	import { ProgressBar } from '@skeletonlabs/skeleton';	
    import { selectedProjectName, selectedDryRunName, selectedMetricsType } from '../../../../../../stores/stores';
    import { goto } from '$app/navigation'
	import { format } from 'date-fns';    
    import { requestGraphQLClient } from '$lib/graphqlUtils';
    //import getDryRunAllMetrics from '../../../../../../queries/get_dry_run_all_metrics_no_logs';
	import Plot from '../Plot.svelte';;
	import { gql } from 'graphql-request';

    selectedMetricsType.set('cpu') // TODO: when specifying specific metric?

	const datefmt = 'yyyy-MM-dd HH:mm:ss';

	function buildMetricQuery(metrics: string[]) {
		let metric_string = ``;
		for (let i=0; i< metrics.length; i++) {
			metric_string += `${metrics[i]} {
			timestamp
			value
			}
		`
		};
		let metricq = `query getDryRunAllMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				... on DryRunNodePod {
					displayName
					startedAt
					duration
					metrics {
						${metric_string}
						}
					}
				}
			}
		}
		`
		return metricq;
	}

	const getMetricsResponse = async () => {
		const queryString = buildMetricQuery(['cpuUsageSecondsTotal', 'memoryUsageBytes', 'networkReceiveBytesTotal', 'networkTransmitBytesTotal']);
		console.log(queryString);
		const metricsQuery = gql`${queryString}`;
		const dryrun_variables = {
			dryRunId: $selectedDryRunName
		};
        const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
            metricsQuery, 
            dryrun_variables
        )
        return metrics_response?.dryRun?.nodes;
    };

	const getDataPromise = getMetricsResponse();

    // metrics
	interface metrics { x: string[]; y: number[]; type: string; name: string };
	interface allMetrics { [metric: string] : metrics[] };

	const metric_metadata = {
		'cpu': {'ylabel': 'cpu usage'},
		'memory': {'ylabel': 'bytes'},
		'network': {'ylabel': 'bytes'}
	}
	var metricsData: allMetrics = {};
	Object.keys(metric_metadata).forEach((metric) => {
		metricsData[metric] = [];
	});

	getDataPromise
		.then((data: any) => {
			data?.forEach(
				(node: {
					displayName: string | number;
					startedAt: string;
					metrics: {
						cpuUsageSecondsTotal: any[];
						memoryUsageBytes: any[];
						networkReceiveBytesTotal: any[];
						networkTransmitBytesTotal: any[];
						cpuSystemUsageSecondsTotal: any[];
					};
				}) => {
					if (isEmpty(node) === false) {
						let cpuTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.cpuUsageSecondsTotal.map((item: { timestamp: any }) => item.timestamp)
						);
						let memTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.memoryUsageBytes.map((item: { timestamp: any }) => item.timestamp)
						);
						let nrcTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.networkReceiveBytesTotal.map(
								(item: { timestamp: any }) => item.timestamp
							)
						);
						let ntrTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.networkTransmitBytesTotal.map(
								(item: { timestamp: any }) => item.timestamp
							)
						);
						let cpuValues = node.metrics.cpuUsageSecondsTotal.map((item: { value: string }) =>
							Number(item.value)
						);
						let memValues = node.metrics.memoryUsageBytes.map((item: { value: string }) =>
							Number(item.value)
						);
						let nrcValues = node.metrics.networkReceiveBytesTotal.map((item: { value: string }) =>
							Number(item.value)
						);
						let ntrValues = node.metrics.networkTransmitBytesTotal.map((item: { value: string }) =>
							Number(item.value)
						);
						var cpuUsage = {
							x: cpuTimestamps,
							y: cpuValues,
							type: 'scatter',
							name: truncateString(node.displayName as string, 15)
						};
						var memoryUsage = {
							x: memTimestamps,
							y: memValues,
							type: 'scatter',
							name: truncateString(node.displayName as string, 15)
						};
						var networkReceiveBytesTotal = {
							x: nrcTimestamps,
							y: nrcValues,
							type: 'scatter',
							name: `Received ${truncateString(node.displayName as string, 15)}`
						};
						var networkTransmitBytesTotal = {
							x: ntrTimestamps,
							y: ntrValues,
							type: 'scatter',
							name: `Transmitted ${truncateString(node.displayName as string, 15)}`
						};
						if (cpuValues.length > 0) {
							metricsData['cpu'].push(cpuUsage);
						}
						if (memValues.length > 0) {
							metricsData['memory'].push(memoryUsage);
						}
						if (nrcValues.length > 0) {
							metricsData['network'].push(networkReceiveBytesTotal);
						}
						if (ntrValues.length > 0) {							
							metricsData['network'].push(networkTransmitBytesTotal);
						}
					}
				}
			);
		})
		.catch((error) => {
			console.log(error);
		});
     
    // TODO: These functions are the same as in [resource].svelte
    // should be merged and moved into lib?
    
    function isEmpty(obj: any) {
		return Object.keys(obj).length === 0;
	}

    function truncateString(word: string, maxLength: number) {
		if (word.length > maxLength) {
			return word.slice(0, maxLength) + '..';
		}
		return word;
	}

	function addSeconds(date: Date, seconds: number) {
		date.setSeconds(date.getSeconds() + seconds);
		let dateStr = format(date, datefmt);
		return dateStr;
	}    

    function timestampsToDatetime(startedAt: string, input_array: number[]) {
		let date = new Date(startedAt);
		let timeseries = [addSeconds(date, 0)];
		for (let i = 0; i < input_array.length - 1; i++) {
			let v = input_array[i + 1] - input_array[i];
			let newDate = addSeconds(date, v);
			timeseries.push(newDate);
		}
		return timeseries;
	}

</script>

<div class="flex w-full content-center p-10">
	<div class="w-full h-screen">
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<h1>
				<a href="/projects">Projects</a>
				<span STYLE="font-size:14px">/ </span>
				<button on:click={() => goto(`/projects/[project_id]/${$selectedProjectName}`)}
					>{$selectedProjectName}
				</button>
				<span STYLE="font-size:14px">/ </span>
				<button on:click={() => goto(`/projects/[project_id]/${$selectedProjectName}/${$selectedDryRunName}`)} 
					>{$selectedDryRunName}
				</button>
				<span STYLE="font-size:14px">/ {$selectedMetricsType}</span>
			</h1>
			<div class="grid grid-cols-2 gap-4 h-full w-full">
				{#each Object.keys(metricsData) as metric}
					<div class="flex card p-2">
						<div class="place-self-center h-full w-full">
							<Plot 
								data={metricsData[metric]}
								plot_title={metric}
								xaxis_title='time'
								yaxis_title={metric_metadata[metric].ylabel}
							 />	
						</div>
					</div>
				{/each}
			</div>
		{/await}		
	</div>
</div>


