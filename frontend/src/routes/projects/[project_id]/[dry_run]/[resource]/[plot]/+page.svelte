<script lang='ts'>
	import { ProgressBar } from '@skeletonlabs/skeleton';	
    import { selectedProjectName, selectedDryRunName, selectedMetricsType } from '../../../../../../stores/stores';
    import { goto } from '$app/navigation'
	import { format } from 'date-fns';    
    import { requestGraphQLClient } from '$lib/graphqlUtils';
    import getDryRunAllMetrics from '../../../../../../queries/get_dry_run_all_metrics_no_logs';;

    
    selectedMetricsType.set('cpu') // TODO: when specifying specific metric?

	const datefmt = 'yyyy-MM-dd HH:mm:ss';


	const getMetricsResponse = async () => {
		const dryrun_variables = {
			dryRunId: $selectedDryRunName
		};
        const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
            getDryRunAllMetrics, 
            dryrun_variables
        )
        return metrics_response?.dryRun?.nodes;
    };

	const getDataPromise = getMetricsResponse();

    // metrics types
	var cpuData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var memoryData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var networkDataCombined: {
		[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
	} = {};    

	getDataPromise
		.then((data: any) => {
			data?.forEach(
				(node: {
					log: string;
					displayName: string | number;
					startedAt: string;
					metrics: {
						cpuUsageSecondsTotal: any[];
						memoryUsageBytes: any[];
						networkReceiveBytesTotal: any[];
						networkTransmitBytesTotal: any[];
					};
				}) => {
					// TODO: make more efficient if data missing?
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
							cpuData[node.displayName as string] = cpuUsage;
						}

						if (memValues.length > 0) {
							memoryData[node.displayName as string] = memoryUsage;
						}

						if (nrcValues.length > 0) {
							if (!networkDataCombined[node.displayName as string])
								networkDataCombined[node.displayName as string] = [];
							networkDataCombined[node.displayName as string].push(networkReceiveBytesTotal);
						}
						if (ntrValues.length > 0) {
							if (!networkDataCombined[node.displayName as string])
								networkDataCombined[node.displayName as string] = [];
							networkDataCombined[node.displayName as string].push(networkTransmitBytesTotal);
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
	<div class="table-container">
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
		{/await}		
	</div>
</div>