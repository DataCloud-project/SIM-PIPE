import { format } from 'date-fns';
import { filesize } from 'filesize';
import { get } from 'svelte/store';
import getDryRunNoLogsMetricsQuery from '$queries/get_dry_run_all_metrics_no_logs';
import { requestGraphQLClient } from '$lib/graphqlUtils';
import type { DryRunMetrics, MetricsWithTimeStamps } from '$typesdefinitions';
import { goto } from '$app/navigation';
import { selectedProject } from '$stores/stores';
// import { displayAlert } from './alerts-utils';

const datefmt = 'yyyy-MM-dd HH:mm:ss';

function truncateString(word: string, maxLength: number): string {
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

export function displayStepDuration(step: DryRunMetrics): number | string {
	const duration = step.duration === undefined ? '-' : step.duration;
	return duration;
}

export type MetricsAnalyticsPerStep = {
	CPU: { max: number; avg: number };
	Memory: { max: number; avg: number };
	Network_received: { max: number; avg: number };
	Network_transferred: { max: number; avg: number };
	Duration: number;
};

export type MetricsAnalytics = {
	[step: string]: MetricsAnalyticsPerStep;
};

const initMaxResourcePerStep = (): MetricsAnalyticsPerStep => ({
	CPU: { max: 0, avg: 0 },
	Memory: { max: 0, avg: 0 },
	Network_received: { max: 0, avg: 0 },
	Network_transferred: { max: 0, avg: 0 },
	Duration: 0
});

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getMetricsResponse = async (dryRunId: string) => {
	const metricsResponse: {
		dryRun: {
			project: any;
			nodes: [];
		};
	} = await requestGraphQLClient(getDryRunNoLogsMetricsQuery, { dryRunId });
	return metricsResponse?.dryRun?.nodes.filter((node) => Object.keys(node).length > 0);
};

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const printReadableBytes = (bytes: number | undefined) =>
	!bytes || Number.isNaN(bytes) || bytes === -1 ? '-' : filesize(bytes);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const printReadablePercent = (value: number | undefined) =>
	!value || Number.isNaN(value) || value === -1 ? '-' : value;

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const calculateMean = (input: number[]) => {
	if (input?.length === 0) return 0;
	return input.reduce((a, b) => a + b, 0) / input.length;
};

const changeResourceFormat = (
	startedAt: string,
	argoUsageBytes: any,
	stepName: string,
	resourceType = ''
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
) => {
	let resourceValues;
	if (resourceType === 'cpu') {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		resourceValues = argoUsageBytes.map((item: { value: string }) => Number(item.value));
		// eslint-disable-next-line no-param-reassign
		resourceType = '';
	} else {
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
		resourceValues = argoUsageBytes.map((item: { value: string }) => Number(item.value));
	}
	const resourceTimestamps = timestampsToDatetime(
		startedAt,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
		argoUsageBytes.map((item: { timestamp: any }) => item.timestamp)
	);
	// TODO: add check to handle when resource metrics are empty
	// if (resourceValues.length > 0) {
	return {
		x: resourceTimestamps,
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
		y: resourceValues,
		type: 'scatter',
		name: `${resourceType} ${truncateString(stepName, 15)}`
	};
};

function findMax(input: number[]): number {
	if (input?.length === 0) return 0;
	return Math.max(...input);
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const calculateDuration = (metrics: DryRunMetrics[]) => {
	const duration =
		metrics?.filter((metric) => metric.type === 'Steps')[0]?.duration ||
		metrics?.filter((metric) => metric.type === 'DAG')[0]?.duration;
	return duration === undefined ? '-' : duration;
};

export async function getMetricsUsageUtils(metrics: DryRunMetrics[]): Promise<{
	allStepNames: string[];
	cpuData: any;
	memoryData: any;
	networkDataCombined: any;
	logs: { [x: string]: string };
}> {
	const allStepNames: string[] = [];
	const cpuData: { [key: string]: MetricsWithTimeStamps } = {};
	const memoryData: { [key: string]: MetricsWithTimeStamps } = {};
	const networkDataCombined: {
		[key: string]: MetricsWithTimeStamps[];
	} = {};
	const logs: { [x: string]: string } = {};
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
					),
					changeResourceFormat(
						node.startedAt,
						node.metrics.networkTransmitBytesTotal,
						node.displayName,
						'Transmitted'
					)
				);
			}
		});

	return { allStepNames, cpuData, memoryData, networkDataCombined, logs };
}

export async function getMetricsAnalyticsUtils(
	allStepNames: string[],
	metrics: DryRunMetrics[],
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] }
): Promise<MetricsAnalytics> {
	const pipelineMetricsAnalytics: MetricsAnalytics = {};

	allStepNames.forEach((name) => {
		pipelineMetricsAnalytics[name] = initMaxResourcePerStep();
		pipelineMetricsAnalytics[name].CPU.max = findMax(cpuData[name].y);
		pipelineMetricsAnalytics[name].CPU.avg = calculateMean(cpuData[name].y);
		pipelineMetricsAnalytics[name].Memory.max = findMax(memoryData[name].y);
		pipelineMetricsAnalytics[name].Memory.avg = calculateMean(memoryData[name].y);
		pipelineMetricsAnalytics[name].Network_received.max = findMax(networkDataCombined[name][0].y);
		pipelineMetricsAnalytics[name].Network_received.avg = calculateMean(
			networkDataCombined[name][0].y
		);
		pipelineMetricsAnalytics[name].Network_transferred.max = findMax(
			networkDataCombined[name][1].y
		);
		pipelineMetricsAnalytics[name].Network_transferred.avg = calculateMean(
			networkDataCombined[name][1].y
		);
	});

	// calculate for total dry run
	pipelineMetricsAnalytics.Total = initMaxResourcePerStep();
	let allValues = allStepNames.flatMap((name) => cpuData[name].y);
	pipelineMetricsAnalytics.Total.CPU.max = findMax(allValues);
	pipelineMetricsAnalytics.Total.CPU.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => memoryData[name].y);
	pipelineMetricsAnalytics.Total.Memory.max = findMax(allValues);
	pipelineMetricsAnalytics.Total.Memory.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => networkDataCombined[name][0].y);
	pipelineMetricsAnalytics.Total.Network_received.max = findMax(allValues);
	pipelineMetricsAnalytics.Total.Network_received.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap((name) => networkDataCombined[name][1].y);
	pipelineMetricsAnalytics.Total.Network_transferred.max = findMax(allValues);
	pipelineMetricsAnalytics.Total.Network_transferred.avg += calculateMean(allValues);
	metrics
		?.filter((item) => item.type === 'Pod')
		?.forEach((step) => {
			pipelineMetricsAnalytics[step.displayName].Duration = step.duration;
		});
	pipelineMetricsAnalytics.Total.Duration = metrics[0].duration;
	delete pipelineMetricsAnalytics.undefined;
	return pipelineMetricsAnalytics;
}

// function to convert different units of memory to bytes
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function convertToBytes(value: number, unit: string) {
	switch (unit) {
		case 'bytes': {
			return value;
		}
		case 'kilobytes': {
			return value * 1000;
		}
		case 'megabytes': {
			return value * 1_000_000;
		}
		case 'gigabytes': {
			return value * 1_000_000_000_000;
		}
		default: {
			return Number.NaN;
		} // Invalid unit
	}
}

// function to check if the filesizes of the selected dry runs can be used for linear regression
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function isFileSizeValid(input: number[]) {
	// Check if all values are the same
	if (new Set(input).size !== 1) {
		const title = 'All filesize values are the same. Unable to perform linear regression';
		const body = `Please choose other dryruns. You will be taken back to the dry runs list on close`;
		// await displayAlert(title, body);
		console.log(title, body);
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/projects/dryruns/${get(selectedProject)?.id}`);
	}
}

// function to do linear regression of filesizes and metrics and return the estimate for an input
export async function linearRegression(
	x: number[],
	y: number[],
	inputFileSize: number
): Promise<number> {
	// Check if all x values are the same
	if (new Set(x).size !== 1) {
		const n = x.length;
		const meanX = x.reduce((accumulator, value) => accumulator + value, 0) / n;
		const meanY = y.reduce((accumulator, value) => accumulator + value, 0) / n;
		const numerator = x.reduce(
			(accumulator, xi, index) => accumulator + (xi - meanX) * (y[index] - meanY),
			0
		);
		const denominator = x.reduce((accumulator, xi) => accumulator + (xi - meanX) ** 2, 0);
		const slope = numerator / denominator;
		const intercept = meanY - slope * meanX;
		return (slope * inputFileSize + intercept).toFixed(3) as unknown as number;
	}
	return -1;
}

export const ALL_UNITS = ['bytes', 'kilobytes', 'megabytes', 'gigabytes'];
