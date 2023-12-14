import { format } from 'date-fns';
import getDryRunNoLogsMetricsQuery from '../queries/get_dry_run_all_metrics_no_logs';
import { requestGraphQLClient } from '$lib/graphqlUtils';
import { readable_time_difference } from '$lib/time_difference.js';
import type { DryRunMetrics } from '../types';

const datefmt = 'yyyy-MM-dd HH:mm:ss';

function truncateString(word: string, maxLength: number) {
	if (word.length > maxLength) {
		return word.slice(0, maxLength) + '..';
	}
	return word;
}

function addSeconds(date: Date, seconds: number) {
	date.setSeconds(date.getSeconds() + seconds);
	const dateStr = format(date, datefmt);
	return dateStr;
}

function timestampsToDatetime(startedAt: string, input_array: number[]) {
	const date = new Date(startedAt);
	const timeseries = [addSeconds(date, 0)];
	for (let i = 0; i < input_array.length - 1; i++) {
		const v = input_array[i + 1] - input_array[i];
		const newDate = addSeconds(date, v);
		timeseries.push(newDate);
	}
	return timeseries;
}

export function displayDryRunDuration(status: string, nodes: DryRunMetrics[]) {
	const firstNode = nodes ? nodes[0] : undefined;
	if (firstNode && (status == 'Succeeded' || status == 'Failed' || status == 'Error'))
		return readable_time_difference(firstNode.startedAt, firstNode.finishedAt);
	return '-';
}

export function displayStepDuration(step: DryRunMetrics) {
	if (step.startedAt && step.finishedAt) {
		return readable_time_difference(step.startedAt, step.finishedAt);
	}
	return '-';
}

export type MetricsAnalytics = {
	[step: string]: {
		CPU: { max: number, avg: number };
		Memory: { max: number, avg: number };
		Network_received: { max: number, avg: number };
		Network_transferred: { max: number, avg: number };
		Duration: number;
	};
};

const initMaxResourcePerStep = () => {
	return {
		CPU: {max: 0, avg: 0},
		Memory: {max: 0, avg: 0},
		Network_received: {max: 0, avg: 0},
		Network_transferred: {max: 0, avg: 0},
		Duration: 0
	};	
};

export const getMetricsResponse = async (dryRunId: string) => {
	const metrics_response: { dryRun: {
		project: any; nodes: [] 
} } = await requestGraphQLClient(
		getDryRunNoLogsMetricsQuery,
		{ dryRunId }
	);
	return metrics_response?.dryRun?.nodes;
};

const calculateMean = (input: number[]) => {
	if(input?.length == 0)
		return -1;
	return input.reduce((a, b) => a + b, 0) / input.length;
};

const changeResourceFormat = (startedAt: string, argoUsageBytes: any, stepName: string, networkType = '') => {
	const resourceValues = argoUsageBytes.map((item: { value: string }) =>
		Number(item.value)
	);
	const resourceTimestamps = timestampsToDatetime(
		startedAt,
		argoUsageBytes.map((item: { timestamp: any }) => item.timestamp)
	);
	// TODO: add check to handle when resource metrics are empty
	// if (resourceValues.length > 0) {
		return {
			x: resourceTimestamps,
			y: resourceValues,
			type: 'scatter',
			name: `${networkType} ${truncateString(stepName, 15)}`
		};
	// }
	// return {};
};

const findMax = (input:number[]) => {
	if(input?.length == 0) 
		return -1;
	return Math.max(...input);	
};

const calculateDuration = (metrics:DryRunMetrics[], allStepNames:string[]) => { 
	metrics?.forEach(
		(node: DryRunMetrics) => {
			if(node.phase == 'Succeeded')
				return (new Date(metrics[allStepNames.length].finishedAt).getTime() - new Date(metrics[1].startedAt).getTime())/1000;
			// else 
		});
	return (new Date(metrics[allStepNames.length].finishedAt).getTime() - new Date(metrics[1].startedAt).getTime())/1000;
}

export async function getMetricsUsageUtils(
	showMax: boolean,
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] },
	logs: { [x: string]: string },
	metrics: DryRunMetrics[]
): Promise<{ showMax: boolean; allStepNames: string[] }> {
	const allStepNames: string[] = [];

	metrics?.forEach(
		(node: DryRunMetrics) => {
			if (Object.keys(node).length != 0) {
				allStepNames.push(node.displayName);
				if (node.log) {
					logs[node.displayName] = node.log[0];
				}
				cpuData[node.displayName] = changeResourceFormat(node.startedAt, node.metrics.cpuUsageSecondsTotal, node.displayName);
				memoryData[node.displayName] = changeResourceFormat(node.startedAt, node.metrics.memoryUsageBytes, node.displayName);
				if(!networkDataCombined[node.displayName])
					networkDataCombined[node.displayName] = [];
				networkDataCombined[node.displayName].push(changeResourceFormat(node.startedAt, node.metrics.networkReceiveBytesTotal, node.displayName, 'Received'));
				networkDataCombined[node.displayName].push(changeResourceFormat(node.startedAt, node.metrics.networkTransmitBytesTotal, node.displayName, 'Transmitted'));
			}
		}	
	);
	
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
	allStepNames.forEach((name) => {
		pipelineMetricsAnalytics[name] = initMaxResourcePerStep();
		if (cpuData[name]?.y.length > 0) {
			pipelineMetricsAnalytics[name].CPU.max = Math.max(...cpuData[name].y);
			pipelineMetricsAnalytics[name].CPU.avg = calculateMean(cpuData[name].y);
			
		}
		if (memoryData[name]?.y.length > 0) {
			pipelineMetricsAnalytics[name].Memory.max = Math.max(...memoryData[name].y);
			pipelineMetricsAnalytics[name].Memory.avg = calculateMean(memoryData[name].y);
		}
		if (networkDataCombined[name]?.[0].y.length > 0) {
			pipelineMetricsAnalytics[name].Network_received.max = Math.max(
				...networkDataCombined[name][0].y
			);
			pipelineMetricsAnalytics[name].Network_received.avg = calculateMean(
				networkDataCombined[name][0].y
			);
		}
		if (networkDataCombined[name]?.[1].y.length > 0) {
			pipelineMetricsAnalytics[name].Network_transferred.max = Math.max(
				...networkDataCombined[name][1].y
			);
			pipelineMetricsAnalytics[name].Network_transferred.avg = calculateMean(
				networkDataCombined[name][1].y
			);
		}
	});

	// calculate for total dry run
	pipelineMetricsAnalytics['Total'] = initMaxResourcePerStep();
	let allValues = allStepNames.flatMap(name => cpuData[name].y);
	pipelineMetricsAnalytics['Total'].CPU.max = findMax(allValues);
	pipelineMetricsAnalytics['Total'].CPU.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap(name => memoryData[name].y);
	pipelineMetricsAnalytics['Total'].Memory.max = findMax(allValues);
	pipelineMetricsAnalytics['Total'].Memory.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap(name => networkDataCombined[name][0].y);
	pipelineMetricsAnalytics['Total'].Network_received.max = findMax(allValues);
	pipelineMetricsAnalytics['Total'].Network_received.avg += calculateMean(allValues);
	allValues = allStepNames.flatMap(name => networkDataCombined[name][1].y);
	pipelineMetricsAnalytics['Total'].Network_transferred.max = findMax(allValues);
	pipelineMetricsAnalytics['Total'].Network_transferred.avg += calculateMean(allValues);

	metrics.filter((item) => item.type === 'Pod').forEach((step) => {
		pipelineMetricsAnalytics[step.displayName].Duration = step.duration;
	});
	// if all steps succeeded
	pipelineMetricsAnalytics['Total'].Duration = calculateDuration(metrics, allStepNames);
	delete pipelineMetricsAnalytics['undefined'];
}
