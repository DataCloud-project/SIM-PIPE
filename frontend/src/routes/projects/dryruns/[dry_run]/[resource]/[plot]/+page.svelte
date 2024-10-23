<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { format } from 'date-fns';
	import { gql } from 'graphql-request';
	import { selectedProjectName, selectedDryRunName, selectedMetricsType } from '$stores/stores';
	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import Plot from '../plot.svelte';
	// import { displayAlert } from '$utils/alerts-utils';

	const datefmt = 'yyyy-MM-dd HH:mm:ss';
	const defaultMetricsType = 'All';
	selectedMetricsType.set(defaultMetricsType);

	// TODO: These functions are the same as in [resource].svelte
	// should be merged and moved into lib?
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	function isEmpty(obj: any) {
		return Object.keys(obj).length === 0;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	function truncateString(word: string, maxLength: number) {
		if (word.length > maxLength) {
			return `${word.slice(0, maxLength)}..`;
		}
		return word;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	function addSeconds(date: Date, seconds: number) {
		date.setSeconds(date.getSeconds() + seconds);
		const dateStr = format(date, datefmt);
		return dateStr;
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	function timestampsToDatetime(startedAt: string, input_array: number[]) {
		const date = new Date(startedAt);
		const timeseries = [addSeconds(date, 0)];
		for (let index = 0; index < input_array.length - 1; index += 1) {
			const v = input_array[index + 1] - input_array[index];
			const newDate = addSeconds(date, v);
			timeseries.push(newDate);
		}
		return timeseries;
	}

	// metrics
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface metrics {
		x: string[];
		y: number[];
		type: string;
		name: string;
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface allMetrics {
		[metric: string]: metrics[];
	}
	// eslint-disable-next-line @typescript-eslint/naming-convention
	interface metricMetadata {
		[metric: string]: { metric_sources: string[]; ylabel: string; type: string };
	}

	// eslint-disable-next-line @typescript-eslint/naming-convention
	const metric_metadata: metricMetadata = {
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
	const metricsData: allMetrics = {};
	const metricSources: string[] = [];

	function buildMetricQuery(metrics: string[]): string {
		let metricString = ``;
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

	const getMetricsResponse = async () => {
		Object.keys(metric_metadata).forEach((metric) => {
			metricsData[metric] = [];
			// eslint-disable-next-line @typescript-eslint/dot-notation
			metric_metadata[metric]['metric_sources'].forEach((metric_source) => {
				metricSources.push(metric_source);
			});
		});
		const queryString = buildMetricQuery(metricSources);
		const metricsQuery = gql`
			${queryString}
		`;
		const dryrunVariables = {
			dryRunId: $selectedDryRunName
		};
		const metricsResponse: { dryRun: { nodes: [] } } = await requestGraphQLClient(
			metricsQuery,
			dryrunVariables
		);
		return metricsResponse?.dryRun?.nodes;
	};

	const getDataPromise = getMetricsResponse();

	getDataPromise
		.then((data: any) => {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			data?.forEach(
				(node: {
					displayName: string | number;
					startedAt: string;
					metrics: {
						[metric_source: string]: { timestamp: string; value: string }[];
					};
				}) => {
					if (isEmpty(node) === false) {
						Object.keys(metric_metadata).forEach((metric) => {
							// eslint-disable-next-line @typescript-eslint/dot-notation
							const metricSources = metric_metadata[metric]['metric_sources'];
							metricSources.forEach((metric_source) => {
								const timestamps = timestampsToDatetime(
									node.startedAt,
									// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
									node.metrics[metric_source].map((item: { timestamp: any }) => item.timestamp)
								);
								const values = node.metrics[metric_source].map((item: { value: string }) =>
									Number(item.value)
								);
								const metricData = {
									x: timestamps,
									y: values,
									// eslint-disable-next-line @typescript-eslint/dot-notation
									type: metric_metadata[metric]['type'],
									name: truncateString(node.displayName as string, 15)
								};
								if (values.length > 0) {
									metricsData[metric].push(metricData);
								}
							});
						});
					}
				}
			);
		})
		.catch(async (error) => {
			console.log(error);
			const title = 'Error reading resource consumption of dry run❌!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
			// eslint-disable-next-line @typescript-eslint/no-floating-promises
			goto(`/projects/dryruns/${$selectedProjectName}/${$selectedDryRunName}`);
		});
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
				<button on:click={() => goto(`/projects/dryruns/${$selectedProjectName}`)}
					>{$selectedProjectName}
				</button>
				<span STYLE="font-size:14px">/ </span>
				<button
					on:click={() => goto(`/projects/dryruns/${$selectedProjectName}/${$selectedDryRunName}`)}
					>{$selectedDryRunName}
				</button>
				<span STYLE="font-size:14px">/ {$selectedMetricsType}</span>
			</h1>
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<label class="label">
						<select class="select" bind:value={$selectedMetricsType}>
							<option value={defaultMetricsType}>{defaultMetricsType}</option>
							{#each Object.keys(metric_metadata) as metric}
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
									plotTitle={metric}
									xaxisTitle="time"
									yaxisTitle={metric_metadata[metric].ylabel}
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
							plotTitle={$selectedMetricsType}
							xaxisTitle="time"
							yaxisTitle={metric_metadata[$selectedMetricsType].ylabel}
						/>
					</div>
				</div>
			{/if}
		{/await}
	</div>
</div>
