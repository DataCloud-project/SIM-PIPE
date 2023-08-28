<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import getDryRunNoLogsMetricsQuery from '../../../../../../queries/get_dry_run_metrics_no_logs.js';
	import { format } from 'date-fns';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';

	export let data;

    const datefmt = 'yyyy-MM-dd HH:mm:ss';
	let workflow: { workflowTemplates: { argoWorkflowTemplate: { spec: { templates: any[] } } }[] };
	let dryrun_results: { dryRun: { nodes: any[] } };

	var cpuData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var memoryData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var networkDataCombined: {
		[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
	} = {};

	const getMetricsResponse = async () => {
		console.log(data);
		const dryrun_variables = {
			dryRunId: data.dry_run
		};
		try {
			const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
				getDryRunNoLogsMetricsQuery,
				dryrun_variables
			);
			return metrics_response?.dryRun?.nodes;
		} catch (error) {
			// internal server error from graphql API when requesting logs for dry runs which has no logs
			if ((error as Error).message.includes('No logs found:')) {
				const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
					getDryRunNoLogsMetricsQuery,
					dryrun_variables
				);
				return metrics_response?.dryRun?.nodes;
			}
		}
	};

	const getData = async (): Promise<{ metrics: any }> => {

		const metrics_response = await getMetricsResponse();

		const responses = {
			metrics: metrics_response
		};
		console.log(responses);
		return responses;
	};

	const getDataPromise = getData();

	getDataPromise
		.then((data: { metrics: any }) => {
			data.metrics?.forEach(
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

					}
				}
			);
		})
		.catch((error) => {
			console.log(error);
		});

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

	function isEmpty(obj: any) {
		return Object.keys(obj).length === 0;
	}

	onMount(async () => {
		await getDataPromise;
	});

</script>

<div class="container p-5">
	<h1>
		<a href="/projects">Projects</a>
		<span STYLE="font-size:14px">/ </span>
		<span STYLE="font-size:14px">/{data.dry_run} </span>

	</h1>
	<div>
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<div class="flex grid-rows-3 p-5 place-content-center">
				<p>Hello World</p>
			</div>
		{/await}
	</div>
</div>
