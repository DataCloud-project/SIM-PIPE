import { format } from 'date-fns';
import getDryRunNoLogsMetricsQuery from '../queries/get_dry_run_all_metrics_no_logs';
import { requestGraphQLClient } from '$lib/graphqlUtils';

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

export type MetricsAnalytics = {
	[step: string]: {
		CPU: { max: number, avg: number };
		Memory: number[];
		Network_received: number[];
		Network_transferred: number[];
	};
};

const initMaxResourcePerStep = () => {
	return {
		CPU: {max: 0, avg: 0},
		// CPU: Array<number>(2).fill(0),
		Memory: Array<number>(2).fill(0),
		Network_received: Array<number>(2).fill(0),
		Network_transferred: Array<number>(2).fill(0)
	};
};

export const getMetricsResponse = async (dryRunId: string) => {
	const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
		getDryRunNoLogsMetricsQuery,
		{ dryRunId }
	);
	return metrics_response?.dryRun?.nodes;
};

const calculateMean = (input: number[]) => input.reduce((a, b) => a + b, 0) / input.length;

export async function getMetricsUsageUtils(
	showMax: boolean,
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] },
	logs: { [x: string]: string },
	metrics: {
		log: string;
		displayName: string;
		startedAt: string;
		metrics: {
			cpuUsageSecondsTotal: any[];
			memoryUsageBytes: any[];
			networkReceiveBytesTotal: any[];
			networkTransmitBytesTotal: any[];
		};
	}[]
): Promise<{ showMax: boolean; allStepNames: string[] }> {
	const allStepNames: string[] = [];

	metrics?.forEach(
		(node: {
			log: string;
			displayName: string;
			startedAt: string;
			metrics: {
				cpuUsageSecondsTotal: any[];
				memoryUsageBytes: any[];
				networkReceiveBytesTotal: any[];
				networkTransmitBytesTotal: any[];
			};
		}) => {
			if ((Object.keys(node).length === 0) == false) {
				allStepNames.push(node.displayName);
				if (node.log) {
					logs[node.displayName] = node.log;
				}
				const cpuTimestamps = timestampsToDatetime(
					node.startedAt,
					node.metrics.cpuUsageSecondsTotal.map((item: { timestamp: any }) => item.timestamp)
				);
				const memTimestamps = timestampsToDatetime(
					node.startedAt,
					node.metrics.memoryUsageBytes.map((item: { timestamp: any }) => item.timestamp)
				);
				const nrcTimestamps = timestampsToDatetime(
					node.startedAt,
					node.metrics.networkReceiveBytesTotal.map((item: { timestamp: any }) => item.timestamp)
				);
				const ntrTimestamps = timestampsToDatetime(
					node.startedAt,
					node.metrics.networkTransmitBytesTotal.map((item: { timestamp: any }) => item.timestamp)
				);
				const cpuValues = node.metrics.cpuUsageSecondsTotal.map((item: { value: string }) =>
					Number(item.value)
				);

				const memValues = node.metrics.memoryUsageBytes.map((item: { value: string }) =>
					Number(item.value)
				);
				const nrcValues = node.metrics.networkReceiveBytesTotal.map((item: { value: string }) =>
					Number(item.value)
				);
				const ntrValues = node.metrics.networkTransmitBytesTotal.map((item: { value: string }) =>
					Number(item.value)
				);
				const cpuUsage = {
					x: cpuTimestamps,
					y: cpuValues,
					type: 'scatter',
					name: truncateString(node.displayName, 15)
				};
				const memoryUsage = {
					x: memTimestamps,
					y: memValues,
					type: 'scatter',
					name: truncateString(node.displayName, 15)
				};
				const networkReceiveBytesTotal = {
					x: nrcTimestamps,
					y: nrcValues,
					type: 'scatter',
					name: `Received ${truncateString(node.displayName, 15)}`
				};
				const networkTransmitBytesTotal = {
					x: ntrTimestamps,
					y: ntrValues,
					type: 'scatter',
					name: `Transmitted ${truncateString(node.displayName, 15)}`
				};

				if (cpuValues.length > 0) {
					showMax = true;
					cpuData[node.displayName] = cpuUsage;
				}

				if (memValues.length > 0) {
					showMax = true;
					memoryData[node.displayName] = memoryUsage;
				}

				if (nrcValues.length > 0) {
					showMax = true;
					if (!networkDataCombined[node.displayName]) networkDataCombined[node.displayName] = [];
					networkDataCombined[node.displayName].push(networkReceiveBytesTotal);
				}
				if (ntrValues.length > 0) {
					showMax = true;
					if (!networkDataCombined[node.displayName]) networkDataCombined[node.displayName] = [];
					networkDataCombined[node.displayName].push(networkTransmitBytesTotal);
				}
			}
		}
	);
	return { showMax, allStepNames };
}

// export async function combineMetricsUsagesStepLevel(
// 	allStepNames:string[],
// 	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string; };},
// 	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string; }; },
// 	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string; }[]; }
// 	) {
// 	allStepNames.forEach(step => {
// 		if (cpuData[step]) cpuData[''].push(cpuData[step]);
// 	});

// }

export async function getMetricsAnalyticsUtils(
	allStepNames: string[],
	pipelineMetricsAnalytics: MetricsAnalytics,
	cpuData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	memoryData: { [x: string]: { x: string[]; y: number[]; type: string; name: string } },
	networkDataCombined: { [x: string]: { x: string[]; y: number[]; type: string; name: string }[] }
): Promise<void> {
	allStepNames.forEach((name) => {
		pipelineMetricsAnalytics[name] = initMaxResourcePerStep();
		if (cpuData[name]) {
			pipelineMetricsAnalytics[name].CPU.max = Math.max(...cpuData[name].y);
			pipelineMetricsAnalytics[name].CPU.avg = calculateMean(cpuData[name].y);
		}
		if (memoryData[name]) {
			pipelineMetricsAnalytics[name].Memory[0] = Math.max(...memoryData[name].y);
			pipelineMetricsAnalytics[name].Memory[1] = calculateMean(memoryData[name].y);
		}
		if (networkDataCombined[name]?.[0]) {
			pipelineMetricsAnalytics[name].Network_received[0] = Math.max(
				...networkDataCombined[name][0].y
			);
			pipelineMetricsAnalytics[name].Network_received[1] = calculateMean(
				networkDataCombined[name][0].y
			);
		}
		if (networkDataCombined[name]?.[1]) {
			pipelineMetricsAnalytics[name].Network_transferred[0] = Math.max(
				...networkDataCombined[name][1].y
			);
			pipelineMetricsAnalytics[name].Network_transferred[1] = calculateMean(
				networkDataCombined[name][1].y
			);
		}
	});
	pipelineMetricsAnalytics[''] = initMaxResourcePerStep();
	allStepNames.forEach((name) => {
		pipelineMetricsAnalytics[''].CPU.max = Math.max(
			pipelineMetricsAnalytics[''].CPU.max,
			pipelineMetricsAnalytics[name].CPU.max
		);
		if (cpuData[name]) pipelineMetricsAnalytics[''].CPU.avg += calculateMean(cpuData[name].y);
		pipelineMetricsAnalytics[''].Memory[0] = Math.max(
			pipelineMetricsAnalytics[''].Memory[0],
			pipelineMetricsAnalytics[name].Memory[0]
		);
		if (memoryData[name])
			pipelineMetricsAnalytics[''].Memory[1] += calculateMean(memoryData[name].y);
		pipelineMetricsAnalytics[''].Network_received[0] = Math.max(
			pipelineMetricsAnalytics[''].Network_received[0],
			pipelineMetricsAnalytics[name].Network_received[0]
		);
		if (networkDataCombined[name]?.[0])
			pipelineMetricsAnalytics[''].Network_received[1] += calculateMean(
				networkDataCombined[name][0].y
			);
		pipelineMetricsAnalytics[''].Network_transferred[0] = Math.max(
			pipelineMetricsAnalytics[''].Network_transferred[0],
			pipelineMetricsAnalytics[name].Network_transferred[0]
		);
		if (networkDataCombined[name]?.[1])
			pipelineMetricsAnalytics[''].Network_transferred[1] += calculateMean(
				networkDataCombined[name][1].y
			);
	});	
	console.log('allStepNames.map((name) => pipelineMetricsAnalytics[name].CPU[1] )');
	console.log(allStepNames.map((name) => pipelineMetricsAnalytics[name].CPU.avg ))

	pipelineMetricsAnalytics[''].CPU.max = Math.max(...allStepNames.map((name) => pipelineMetricsAnalytics[name].CPU.max ));
	pipelineMetricsAnalytics[''].CPU.avg = calculateMean(allStepNames.map((name) => pipelineMetricsAnalytics[name].CPU.avg ));
	// allStepNames.forEach((name) => {
	// 	 = Math.max(
	// 		pipelineMetricsAnalytics[''].CPU[0],
	// 		pipelineMetricsAnalytics[name].CPU[0]
	// 	);
	// 	if (cpuData[name]) pipelineMetricsAnalytics[''].CPU[1] += calculateMean(cpuData[name].y);
	// 	pipelineMetricsAnalytics[''].Memory[0] = Math.max(
	// 		pipelineMetricsAnalytics[''].Memory[0],
	// 		pipelineMetricsAnalytics[name].Memory[0]
	// 	);
	// 	if (memoryData[name])
	// 		pipelineMetricsAnalytics[''].Memory[1] += calculateMean(memoryData[name].y);
	// 	pipelineMetricsAnalytics[''].Network_received[0] = Math.max(
	// 		pipelineMetricsAnalytics[''].Network_received[0],
	// 		pipelineMetricsAnalytics[name].Network_received[0]
	// 	);
	// 	if (networkDataCombined[name]?.[0])
	// 		pipelineMetricsAnalytics[''].Network_received[1] += calculateMean(
	// 			networkDataCombined[name][0].y
	// 		);
	// 	pipelineMetricsAnalytics[''].Network_transferred[0] = Math.max(
	// 		pipelineMetricsAnalytics[''].Network_transferred[0],
	// 		pipelineMetricsAnalytics[name].Network_transferred[0]
	// 	);
	// 	if (networkDataCombined[name]?.[1])
	// 		pipelineMetricsAnalytics[''].Network_transferred[1] += calculateMean(
	// 			networkDataCombined[name][1].y
	// 		);
	// });
	delete pipelineMetricsAnalytics['undefined'];
}
