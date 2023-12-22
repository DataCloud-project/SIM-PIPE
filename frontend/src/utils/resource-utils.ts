import { format } from 'date-fns';
import { filesize } from 'filesize';

import { requestGraphQLClient } from '$lib/graphql-utils';

import getDryRunNoLogsMetricsQuery from '../queries/get-dry-run-all-metrics-no-logs';
import type { DryRun, DryRunMetrics } from '../types';

const datefmt = 'yyyy-MM-dd HH:mm:ss';

// TODO: should it be crypto safe ?
export function generateRandomString(): string {
	let result = '';
	const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < 6) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

export function truncateString(word: string, maxLength: number): string {
	if (word.length > maxLength) {
		return `${word.slice(0, maxLength)}..`;
	}
	return word;
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

export function displayStepDuration(step: DryRunMetrics): string {
	const duration = step.duration === undefined ? '-' : step.duration.toString();
	return duration;
}

type MetricsSerie = {
	CPU: { max: number; avg: number };
	Memory: { max: number; avg: number };
	Network_received: { max: number; avg: number };
	Network_transferred: { max: number; avg: number };
	Duration: number;
};
export type MetricsAnalytics = {
	[step: string]: MetricsSerie;
};

const initMaxResourcePerStep = (): MetricsSerie => ({
	CPU: { max: 0, avg: 0 },
	Memory: { max: 0, avg: 0 },
	Network_received: { max: 0, avg: 0 },
	Network_transferred: { max: 0, avg: 0 },
	Duration: 0
});

export const getMetricsResponse = async (dryRunId: string): Promise<DryRunMetrics[] | undefined> => {
	const metricsResponse = await requestGraphQLClient<{
		dryRun: DryRun,
	}>(getDryRunNoLogsMetricsQuery, { dryRunId });
	return metricsResponse?.dryRun?.nodes.filter((node) => Object.keys(node).length > 0);
};

export const printReadableBytes = (bytes: number | undefined): string =>
	!bytes || Number.isNaN(bytes) || bytes === -1 ? '-' : filesize(bytes * 1_024_000);

export const printReadablePercent = (value: number | undefined): string =>
	!value || Number.isNaN(value) || value === -1 ? '-' : value.toFixed(2);

const calculateMean = (input: number[]): number => {
	if (!input?.length) return 0;
	return input.reduce((a, b) => a + b, 0) / input.length;
};

const changeResourceFormat = (
	startedAt: string,
	argoUsageBytes: { timestamp: number; value: string }[],
	stepName: string,
	resourceType = ''
): {
	x: string[];
	y: number[];
	type: 'scatter';
	name: string;
} => {
	let resourceValues;
	let newResourceType = resourceType;
	if (resourceType === 'cpu') {
		resourceValues = argoUsageBytes.map(({ value }) => Number(value));
		newResourceType = '';
	} else {
		// convert bytes to megabytes
		resourceValues = argoUsageBytes.map(
			(item: { value: string }) => Number(item.value) / 1_024_000
		);
	}
	const resourceTimestamps = timestampsToDatetime(
		startedAt,
		argoUsageBytes.map(({ timestamp }) => timestamp)
	);
	// TODO: add check to handle when resource metrics are empty
	// if (resourceValues.length > 0) {
	return {
		x: resourceTimestamps,
		y: resourceValues,
		type: 'scatter',
		name: `${newResourceType} ${truncateString(stepName, 15)}`
	};
	// }
	// return {};
};

export const calculateDuration = (metrics: DryRunMetrics[]): string => {
	const duration =
		metrics?.filter((metric) => metric.type === 'Steps')[0]?.duration ||
		metrics?.filter((metric) => metric.type === 'DAG')[0]?.duration;
	return duration === undefined ? '-' : duration.toString();
};

export async function getMetricsUsageUtils(
	showMax: boolean,
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] },
	logs: { [x: string]: string },
	metrics: DryRunMetrics[]
): Promise<{ showMax: boolean; allStepNames: string[] }> {
	const allStepNames: string[] = [];

	metrics
		?.filter((metric) => metric.type === 'Pod')
		.forEach((node: DryRunMetrics) => {
			if (Object.keys(node).length > 0) {
				allStepNames.push(node.displayName);
				if (node.log) {
					logs[node.displayName] = node.log.join('\n');
				}
				cpuData[node.displayName] = changeResourceFormat(
					node.startedAt,
					node.metrics.cpuUsageSecondsTotal,
					node.displayName,
					'cpu'
				);
				memoryData[node.displayName] = changeResourceFormat(
					node.startedAt,
					node.metrics.memoryUsageBytes,
					node.displayName
				);
				if (!networkDataCombined[node.displayName]) networkDataCombined[node.displayName] = [];
				networkDataCombined[node.displayName].push(
					changeResourceFormat(
						node.startedAt,
						node.metrics.networkReceiveBytesTotal,
						node.displayName,
						'Received'
					)
				);
				networkDataCombined[node.displayName].push(
					changeResourceFormat(
						node.startedAt,
						node.metrics.networkTransmitBytesTotal,
						node.displayName,
						'Transmitted'
					)
				);
			}
		});

	return { showMax, allStepNames };
}

export async function getMetricsAnalyticsUtils(
	allStepNames: string[],
	metrics: DryRunMetrics[],
	pipelineMetricsAnalytics: MetricsAnalytics,
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] }
): Promise<void> {
	for (const name of allStepNames) {
		pipelineMetricsAnalytics[name] = initMaxResourcePerStep();
		pipelineMetricsAnalytics[name].CPU.max = Math.max(cpuData[name].y);
		pipelineMetricsAnalytics[name].CPU.avg = calculateMean(cpuData[name].y);
		pipelineMetricsAnalytics[name].Memory.max = Math.max(memoryData[name].y);
		pipelineMetricsAnalytics[name].Memory.avg = calculateMean(memoryData[name].y);
		pipelineMetricsAnalytics[name].Network_received.max = Math.max(networkDataCombined[name][0].y);
		pipelineMetricsAnalytics[name].Network_received.avg = calculateMean(
			networkDataCombined[name][0].y
		);
		pipelineMetricsAnalytics[name].Network_transferred.max = Math.max(
			networkDataCombined[name][1].y
		);
		pipelineMetricsAnalytics[name].Network_transferred.avg = calculateMean(
			networkDataCombined[name][1].y
		);
	}

	// calculate for total dry run
	pipelineMetricsAnalytics.Total = initMaxResourcePerStep();
	let allValues = allStepNames.flatMap((name) => cpuData[name].y);
	pipelineMetricsAnalytics.Total.CPU.max = Math.max(allValues);
	pipelineMetricsAnalytics.Total.CPU.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => memoryData[name].y);
	pipelineMetricsAnalytics.Total.Memory.max = Math.max(allValues);
	pipelineMetricsAnalytics.Total.Memory.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => networkDataCombined[name][0].y);
	pipelineMetricsAnalytics.Total.Network_received.max = Math.max(allValues);
	pipelineMetricsAnalytics.Total.Network_received.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => networkDataCombined[name][1].y);
	pipelineMetricsAnalytics.Total.Network_transferred.max = Math.max(allValues);
	pipelineMetricsAnalytics.Total.Network_transferred.avg += calculateMean(allValues);
	metrics
		?.filter((item) => item.type === 'Pod')
		?.forEach((step) => {
			pipelineMetricsAnalytics[step.displayName].Duration = step.duration;
		});
	pipelineMetricsAnalytics.Total.Duration =
		metrics?.filter((metric) => metric.type === 'Steps')[0]?.duration ||
		metrics?.filter((metric) => metric.type === 'DAG')[0]?.duration;
	delete pipelineMetricsAnalytics.undefined;
}
