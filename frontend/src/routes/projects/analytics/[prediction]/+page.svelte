<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		type MetricsAnalytics
	} from '../../../../utils/resource_utils.js';

	export let data;

	type metricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

	const dryruns_for_prediction = data.prediction.split(' ');

	var collectedMetrics: {
		[key: string]: {
			allStepNames: string[];
			cpuData: { [key: string]: metricsWithTimeStamps };
			memoryData: { [key: string]: metricsWithTimeStamps };
			networkDataCombined: { [key: string]: metricsWithTimeStamps[] };
			pipelineMetricsAnalytics: MetricsAnalytics;
		};
	} = {};

	// Linear regression function
	function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
		const n = x.length;

		// Calculate mean of x and y
		const meanX = x.reduce((acc, val) => acc + val, 0) / n;
		const meanY = y.reduce((acc, val) => acc + val, 0) / n;

		// Calculate slope (m) and intercept (b)
		const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
		const denominator = x.reduce((acc, xi) => acc + (xi - meanX) ** 2, 0);

		const slope = numerator / denominator;
		const intercept = meanY - slope * meanX;

		return { slope, intercept };
	}

	// Prediction function
	function predictMaxCPU(fileSize: number, slope: number, intercept: number): number {
		return slope * fileSize + intercept;
	}

	export const getPredictionDetails = async (): Promise<void> => {
		dryruns_for_prediction.forEach(async (dryRunId) => {
			collectedMetrics[dryRunId] = {
				allStepNames: [],
				cpuData: {},
				memoryData: {},
				networkDataCombined: {},
				pipelineMetricsAnalytics: {}
			};
			var cpuData: { [key: string]: metricsWithTimeStamps } = {};
			var memoryData: { [key: string]: metricsWithTimeStamps } = {};
			var networkDataCombined: {
				[key: string]: metricsWithTimeStamps[];
			} = {};
			const metrics = await getMetricsResponse(dryRunId);
			const result = await getMetricsUsageUtils(
				true,
				cpuData,
				memoryData,
				networkDataCombined,
				{},
				metrics
			);
			let pipelineMetricsAnalytics: MetricsAnalytics = {};
			await getMetricsAnalyticsUtils(
				result.allStepNames,
				pipelineMetricsAnalytics,
				cpuData,
				memoryData,
				networkDataCombined
			);

			collectedMetrics[dryRunId].allStepNames = result.allStepNames;
			collectedMetrics[dryRunId].cpuData = cpuData;
			collectedMetrics[dryRunId].memoryData = memoryData;
			collectedMetrics[dryRunId].networkDataCombined = networkDataCombined;
			collectedMetrics[dryRunId].pipelineMetricsAnalytics = pipelineMetricsAnalytics;
			// predictionDetailsPromise.resolve();
		});
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('collected metrics');
		console.log(collectedMetrics);

		// Example usage
		const fileSizeData = [20, 30];
		const maxCpuUsageData = [
			collectedMetrics[dryruns_for_prediction[0]].pipelineMetricsAnalytics[''].CPU[0],
			collectedMetrics[dryruns_for_prediction[1]].pipelineMetricsAnalytics[''].CPU[0]
		];
		// const fileSizeData = [20, 30, 40, 100];
		// const maxCpuUsageData = [0.1, 0.2, 0.3, 0.8];

		// Calculate linear regression
		const { slope, intercept } = linearRegression(fileSizeData, maxCpuUsageData);

		// Example prediction for a given file size
		const predictedMaxCPU = predictMaxCPU(34, slope, intercept);
		console.log(`Predicted Max CPU Usage: ${predictedMaxCPU}`);
		showPredictions = true;
	};
	// const predictionDetailsPromise = getPredictionDetails();

	// // TODO: move to lib or utils
	// predictionDetailsPromise
	// 	.then((value) => {
	// 		maxCpuUsageRun = 1;
	// 		maxCpuUsagePerStep = [1, 0.4, 0.8, 1];
	// 		avgCpuUsageRun = 0.8;
	// 		avgCpuUsagePerStep = [1, 0.4, 0.8, 1];
	// 	})
	// 	.catch(() => {
	// 		console.log('error in prediction details promise');
	// 	});
	let predictionDetailsPromise: { resolve: () => void };
	let valueforPrediction = 0;
	let showPredictions = false;
	$: maxCpuUsageRun = 1;
	$: maxCpuUsagePerStep = [1, 0.4, 0.8, 1];
	$: avgCpuUsageRun = 0.8;
	$: avgCpuUsagePerStep = [1, 0.4, 0.8, 1];
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		<h1>
			Estimations
			<span STYLE="font-size:14px">based on {dryruns_for_prediction} </span>
		</h1>
		<h1>
			Input filesize:
			<span><input bind:value={valueforPrediction} placeholder="enter in bytes" /> </span>
		</h1>
		<div class="flex justify-between">
			<div class="flex flex-row justify-end p-5 space-x-1">
				<div>
					<button type="button" class="btn btn-sm variant-filled" on:click={getPredictionDetails}>
						<span>Predict</span>
					</button>
				</div>
			</div>
		</div>
		{#if showPredictions}
			<!-- {#await predictionDetailsPromise}
			<p style="font-size:20px;">Calculating predictions ....</p>
			<ProgressBar />
		{:then response} -->
			<table class="table table-interactive">
				<thead>
					<tr>
						<th scope="col">Metric</th>
						<th scope="col">Max Run</th>
						<th scope="col">Per Step</th>
						<th scope="col">Avg Run</th>
						<th scope="col">Per Step</th>
					</tr>
				</thead>
				<tbody>
					<!-- Repeat the following for each metric -->
					<tr>
						<td>CPU Usage</td>
						<td>{maxCpuUsageRun}</td>
						<td>
							<!-- Nested table for per-step values -->
							<table class="table table-interactive">
								<tbody>
									{#each avgCpuUsagePerStep as stepValue}
										<tr>
											<td>Step {+1}</td>
											<td>{stepValue}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</td>
						<td>{avgCpuUsageRun}</td>
						<td>
							<!-- Nested table for per-step values -->
							<table class="table table-interactive">
								<tbody>
									{#each avgCpuUsagePerStep as stepValue}
										<tr>
											<td>Step {+1}</td>
											<td>{stepValue}</td>
										</tr>
									{/each}
								</tbody>
							</table>
						</td>
					</tr>
					<!-- Repeat for other metrics -->
				</tbody>
			</table>
			<!-- {/await} -->
		{/if}
	</div>
</div>
