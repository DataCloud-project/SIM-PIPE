<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { gql } from 'graphql-request';

	import { requestGraphQLClient } from '$lib/graphql-utils.js';

	import {
		selectedDryRunName,
		selectedMetricsType,
		selectedProjectName
	} from '../../../../../../stores/stores';
	import { truncateString } from '../../../../../../utils/resource-utils';
	import Plot from '../Plot.svelte';
	import type { DryRun, DryRunMetrics } from '../../../../../../types';

	const datefmt = 'yyyy-MM-dd HH:mm:ss';
	const defaultMetricsType = 'All';
	selectedMetricsType.set(defaultMetricsType);

	// metrics
	interface Metrics {
		x: string[];
		y: number[];
		type: string;
		name: string;
	}
	interface AllMetrics {
		[metric: string]: Metrics[];
	}
	interface MetricMetadata {
		[metric: string]: { metric_sources: string[]; ylabel: string; type: string };
	}

	const metricMetadata: MetricMetadata = {
		cpu: { metric_sources: ['cpuUsageSecondsTotal'], ylabel: 'cpu usage', type: 'scatter' },
		'cpu-system': {
			metric_sources: ['cpuSystemSecondsTotal'],
			ylabel: 'cpu usage system',
			type: 'scatter'
		},
		'cpu-user': {
			metric_sources: ['cpuUserSecondsTotal'],
			ylabel: 'cpu usage user',
			type: 'scatter'
		},
		network: {
			metric_sources: ['networkReceiveBytesTotal', 'networkTransmitBytesTotal'],
			ylabel: 'bytes',
			type: 'scatter'
		},
		memory: { metric_sources: ['memoryUsageBytes'], ylabel: 'bytes', type: 'scatter' },
		'memory-max-usage': {
			metric_sources: ['memoryMaxUsageBytes'],
			ylabel: 'bytes',
			type: 'scatter'
		},
		'memory-cache': { metric_sources: ['memoryCache'], ylabel: 'bytes', type: 'scatter' },
		'memory-fail-count': { metric_sources: ['memoryFailcnt'], ylabel: 'count', type: 'scatter' },
		'memory-failures-total': {
			metric_sources: ['memoryFailuresTotal'],
			ylabel: 'count',
			type: 'scatter'
		},
		'memory-mapped-file': {
			metric_sources: ['memoryMappedFile'],
			ylabel: '<unit>',
			type: 'scatter'
		},
		'memory-RSS': { metric_sources: ['memoryRss'], ylabel: 'bytes', type: 'scatter' },
		'memory-swap': { metric_sources: ['memorySwap'], ylabel: 'bytes', type: 'scatter' },
		'memory-working-set-bytes': {
			metric_sources: ['memoryWorkingSetBytes'],
			ylabel: 'bytes',
			type: 'scatter'
		},
		'file-descriptors': { metric_sources: ['fileDescriptors'], ylabel: '<units>', type: 'scatter' },
		'fs-I-nodes-total': { metric_sources: ['fsInodesTotal'], ylabel: 'count', type: 'scatter' },
		'fs-IO-current': { metric_sources: ['fsIoCurrent'], ylabel: 'count', type: 'scatter' },
		'fs-IO-time-seconds-total': {
			metric_sources: ['fsIoTimeSecondsTotal'],
			ylabel: 'seconds',
			type: 'scatter'
		},
		'fs-IO-time-weighted-seconds-total': {
			metric_sources: ['fsIoTimeWeightedSecondsTotal'],
			ylabel: 'seconds',
			type: 'scatter'
		},
		'fs-reads-merged-total': {
			metric_sources: ['fsReadsMergedTotal'],
			ylabel: '<unit>',
			type: 'scatter'
		},
		'fs-sector-reads-writes-total': {
			metric_sources: ['fsSectorReadsTotal', 'fsSectorWritesTotal'],
			ylabel: 'count',
			type: 'scatter'
		},
		'fs-usage': { metric_sources: ['fsUsageBytes'], ylabel: 'bytes', type: 'scatter' },
		'fs-write-seconds-total': {
			metric_sources: ['fsWriteSecondsTotal'],
			ylabel: 'seconds',
			type: 'scatter'
		}
	};
	const metricsData: AllMetrics = {};
	const metricSources: string[] = [];

	function buildMetricQuery(metrics: string[]): string {
		let metricString = '';
		for (const metric of metrics) {
			metricString += `${metric} {
			timestamp
			value
			}
		`;
		}
		const metricq = `query getDryRunAllMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				... on DryRunNodePod {
					displayName
					startedAt
					duration
					metrics {
						${metricString}
						}
					}
				}
			}
		}
		`;
		return metricq;
	}

	const getMetricsResponse = async (): Promise<DryRunMetrics[]> => {
		for (const metric of Object.keys(metricMetadata)) {
			metricsData[metric] = [];
			for (const metricSource of metricMetadata[metric].metric_sources) {
				metricSources.push(metricSource);
			}
		}
		// console.log(metricSources);
		const queryString = buildMetricQuery(metricSources);
		// console.log(queryString);
		const metricsQuery = gql`
			${queryString}
		`;
		const dryrunVariables = {
			dryRunId: $selectedDryRunName
		};
		const metricsResponse = await requestGraphQLClient<{
			dryRun: DryRun;
		}>(metricsQuery, dryrunVariables);
		return metricsResponse?.dryRun?.nodes;
	};

	function isEmpty(object: object): boolean {
		return Object.keys(object).length === 0;
	}

	function addSeconds(date: Date, seconds: number): string {
		date.setSeconds(date.getSeconds() + seconds);
		const dateString = format(date, datefmt);
		return dateString;
	}

	function timestampsToDatetime(startedAt: string, input_array: number[]): string[] {
		const date = new Date(startedAt);
		const timeseries = [addSeconds(date, 0)];
		for (let index = 0; index < input_array.length - 1; index += 1) {
			const v = input_array[index + 1] - input_array[index];
			const newDate = addSeconds(date, v);
			timeseries.push(newDate);
		}
		return timeseries;
	}

	const getDataPromise = getMetricsResponse();

	getDataPromise
		.then((data) => {
			// data?.forEach(
			for (const node of data) {
				if (isEmpty(node) === false) {
					for (const metric of Object.keys(metricMetadata)) {
						const { metric_sources: localMetricSources } = metricMetadata[metric];
						for (const metricSource of localMetricSources) {
							const timestamps = timestampsToDatetime(
								node.startedAt,
								node.metrics[metricSource].map(({ timestamp }) => Number.parseInt(timestamp, 10))
							);
							const values = node.metrics[metricSource].map((item: { value: string }) =>
								Number(item.value)
							);
							const metricData = {
								x: timestamps,
								y: values,
								type: metricMetadata[metric].type,
								name: truncateString(node.displayName, 15)
							};
							if (values.length > 0) {
								metricsData[metric].push(metricData);
							}
						}
					}
				}
			}
		})
		// eslint-disable-next-line unicorn/prefer-top-level-await
		.catch((error) => {
			// TODO: implement proper error handling
			// eslint-disable-next-line no-console
			console.log(error);
		});

	// TODO: These functions are the same as in [resource].svelte
	// should be merged and moved into lib?
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
				<a href={`/projects/project_id/${$selectedProjectName}`}>{$selectedProjectName}</a>
				<span STYLE="font-size:14px">/ </span>
				<a href={`/projects/project_id/${$selectedProjectName}/${$selectedDryRunName}`}>
					{$selectedDryRunName}
				</a>
				<span STYLE="font-size:14px">/ {$selectedMetricsType}</span>
			</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<label class="label">
						<select class="select" bind:value={$selectedMetricsType}>
							<option value={defaultMetricsType}>{defaultMetricsType}</option>
							{#each Object.keys(metricMetadata) as metric}
								<option value={metric}>{metric}</option>
							{/each}
						</select></label
					>
				</div>
			</div>
			{#if $selectedMetricsType === 'All'}
				<div class="grid grid-cols-2 gap-4 w-full">
					{#each Object.keys(metricsData) as metric}
						<div class="flex card p-2 h-80">
							<div class="place-self-center h-full w-full">
								<Plot
									data={metricsData[metric]}
									plot_title={metric}
									xaxis_title="time"
									yaxis_title={metricMetadata[metric].ylabel}
								/>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<div class="flex card p-2 h-5/6 w-full">
					<div class="place-self-center h-full w-full">
						<Plot
							data={metricsData[$selectedMetricsType]}
							plot_title={$selectedMetricsType}
							xaxis_title="time"
							yaxis_title={metricMetadata[$selectedMetricsType].ylabel}
						/>
					</div>
				</div>
			{/if}
		{/await}
	</div>
</div>
