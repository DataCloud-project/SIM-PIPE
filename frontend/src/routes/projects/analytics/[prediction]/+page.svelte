<script lang="ts">
	import { ProgressBar, type ModalSettings, modalStore, Modal } from '@skeletonlabs/skeleton';
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		type MetricsAnalytics
	} from '../../../../utils/resource_utils.js';
	import { fileSizes, selectedProject } from '../../../../stores/stores.js';
	import { goto } from '$app/navigation';

	export let data;

	type metricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

	const dryruns_for_prediction = data.prediction.split(' ');
	let allStepNames: string[];

	var collectedMetrics: {
		[key: string]: {
			// cpuData: { [key: string]: metricsWithTimeStamps };
			// memoryData: { [key: string]: metricsWithTimeStamps };
			// networkDataCombined: { [key: string]: metricsWithTimeStamps[] };
			pipelineMetricsAnalytics: MetricsAnalytics;
		};
	} = {};

	function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
		const n = x.length;

		const meanX = x.reduce((acc, val) => acc + val, 0) / n;
		const meanY = y.reduce((acc, val) => acc + val, 0) / n;

		const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
		const denominator = x.reduce((acc, xi) => acc + (xi - meanX) ** 2, 0);

		const slope = numerator / denominator;
		const intercept = meanY - slope * meanX;

		return { slope, intercept };
	}

	function predictMaxCPU(fileSize: number, slope: number, intercept: number): number {
		return slope * fileSize + intercept;
	}

	export const getPredictionDetails = async (): Promise<void> => {
		dryruns_for_prediction.forEach(async (dryRunId) => {
			collectedMetrics[dryRunId] = {
				// cpuData: {},
				// memoryData: {},
				// networkDataCombined: {},
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

			allStepNames = result.allStepNames;
			// collectedMetrics[dryRunId].cpuData = cpuData;
			// collectedMetrics[dryRunId].memoryData = memoryData;
			// collectedMetrics[dryRunId].networkDataCombined = networkDataCombined;
			collectedMetrics[dryRunId].pipelineMetricsAnalytics = pipelineMetricsAnalytics;
		});
		await new Promise((resolve) => setTimeout(resolve, 1500));

		console.log('collected metrics');
		console.log(collectedMetrics);

		const fileSizeData = dryruns_for_prediction.map(async (dryrun) => {
			const size = fileSizes[dryrun]?.[0]?.size;
			// console.log('file sizes from store')
			// console.log(fileSizes)
			if(!size) {
				validFileSizes = false;
				let createDryRunMessageModal: ModalSettings;
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Invalid filesizes! Please select some other dry runs to make predictions',
					body: 'You will be taken back to the dry runs list on close'
				};
				modalStore.trigger(createDryRunMessageModal);
				await new Promise((resolve) => setTimeout(resolve, 2500));
				modalStore.close();
				goto(`/projects/project_id/${$selectedProject?.id}`);
				return;
				}
			return size;
		});
		
		const CpuUsageDataPerStep: Record<string, { max: number[], avg: number[] }> = [...allStepNames, ''].reduce((acc, stepName) => ({ ...acc, [stepName]: { max: [], avg: [] } }), {});
		dryruns_for_prediction.forEach((dryrunId) => {
			[...allStepNames, ''].forEach((stepName) => {
				const maxCpuUsage = collectedMetrics[dryrunId].pipelineMetricsAnalytics[stepName]?.CPU.max;
				const avgCpuUsage = collectedMetrics[dryrunId].pipelineMetricsAnalytics[stepName]?.CPU.avg;

				if (maxCpuUsage) {								
					CpuUsageDataPerStep[stepName].max.push(maxCpuUsage);
					CpuUsageDataPerStep[stepName].avg.push(avgCpuUsage);
				}
			});
		});		

		maxCpuUsagePerStep = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = linearRegression(await Promise.all(fileSizeData) as number[], CpuUsageDataPerStep[stepName].max);
			maxCpuUsagePerStep[i] = predictMaxCPU(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});
		avgCpuUsagePerStep = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = linearRegression(await Promise.all(fileSizeData) as number[], CpuUsageDataPerStep[stepName].avg);
			avgCpuUsagePerStep[i] = predictMaxCPU(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});

		showPredictions = true;
	};
	let predictionDetailsPromise: { resolve: () => void };
	let valueforPrediction = 234;
	let showPredictions = false;
	let validFileSizes = true;
	let maxCpuUsagePerStep: number[];
	let avgCpuUsagePerStep:number[];
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		<h1>
			Estimations
			<span STYLE="font-size:14px">based on {dryruns_for_prediction} </span>
		</h1>
		{#if validFileSizes} 
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
				<table class="table">
					<thead>
						<tr>
							<th scope="col">Metric</th>
							<th scope="col">Predicted Maximum</th>
							<th scope="col">Predicted Average</th>
						</tr>
					</thead>
					<tbody>
						<!-- Repeat the following for each metric -->
						<tr>
							<td>CPU Usage</td>
							<td>
								<table class="table">
									<tbody>
										{#each allStepNames as name, i}
											<tr>
												<td>{name}</td>
												<td>{maxCpuUsagePerStep[i]}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{maxCpuUsagePerStep.slice(-1)[0]}</td>
										</tr>
									</tbody>
								</table>
							</td>
							
							<td>
								<table class="table">
									<tbody>
										{#each allStepNames as name, i}
											<tr>
												<td>{name}</td>
												<td>{avgCpuUsagePerStep[i]}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{avgCpuUsagePerStep.slice(-1)[0]}</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<!-- Repeat for other metrics -->
					</tbody>
				</table>
			{/if}
		{:else}
			<h1>
				
			</h1>	
			<div class="flex flex-row p-5 space-x-1">
				<div>
					<button type="button" class="btn variant-filled-warning">
						<span>Invalid filesizes! Please select some other dry runs to make predictions.</span>
					</button>
				</div>
			</div>
		{/if}
	</div>
</div>

<Modal />
