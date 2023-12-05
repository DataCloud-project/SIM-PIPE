<script lang="ts">
	import { type ModalSettings, modalStore, Modal } from '@skeletonlabs/skeleton';
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		type MetricsAnalytics
	} from '../../../../utils/resource_utils.js';
	import { selectedProject } from '../../../../stores/stores.js';
	import { goto } from '$app/navigation';
	import { filesize } from 'filesize';
	import getDryRunInputFilesizeQuery from '../../../../queries/get_dry_run_phase_results copy.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';

	export let data;

	type metricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

	const dryruns_for_prediction = data.prediction.split(' ');
	let allStepNames: string[];
	var collectedMetrics: {
		[key: string]: MetricsAnalytics;
	} = {};

	async function linearRegression(x: number[], y: number[]): Promise<{ slope: number; intercept: number; }> {
		 // Check if all x values are the same
		 if (new Set(x).size === 1) {
			// throw new Error(`All filesize values are the same. Unable to perform linear regression.\n Filesizes for prediction are ${x}`);
			validFileSizes = false;
				let createDryRunMessageModal: ModalSettings;
				createDryRunMessageModal = {
					type: 'alert',
					title: 'All filesize values are the same. Unable to perform linear regression',
					body: `Filesizes for prediction are ${x}. Please choose other filesizes. You will be taken back to the dry runs list on close`
				};
				modalStore.trigger(createDryRunMessageModal);
				await new Promise((resolve) => setTimeout(resolve, 2500));
				modalStore.close();
				goto(`/projects/project_id/${$selectedProject?.id}`);
				return { slope:0, intercept:0 };
		}
		const n = x.length;
		const meanX = x.reduce((acc, val) => acc + val, 0) / n;
		const meanY = y.reduce((acc, val) => acc + val, 0) / n;
		const numerator = x.reduce((acc, xi, i) => acc + (xi - meanX) * (y[i] - meanY), 0);
		const denominator = x.reduce((acc, xi) => acc + (xi - meanX) ** 2, 0);
		
		const slope = numerator / denominator;
		const intercept = meanY - slope * meanX;		
		return { slope, intercept };
	}

	function predictLinearRegression(fileSize: number, slope: number, intercept: number): number {
		return slope * fileSize + intercept;
	}

	// for each selected dry run, get the resource analytics (avg, max) per step and per dry run level
	export const getPredictionDetails = async (): Promise<void> => {
		dryruns_for_prediction.forEach(async (dryRunId) => {
			collectedMetrics[dryRunId] = {};
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
			collectedMetrics[dryRunId] = pipelineMetricsAnalytics;
		});
		await new Promise((resolve) => setTimeout(resolve, 1500));

		// read and store filesizes stored in the annotations in argoworkflows of the selected dryruns
		const fileSizeDataPromise = dryruns_for_prediction.map(async (dryRunId) => { 		
			try {
				const response: { dryRun: { argoWorkflow: {metadata: {annotations: any }} }} = await requestGraphQLClient(
					getDryRunInputFilesizeQuery,
					{ dryRunId }
				);				
				return Number(response.dryRun.argoWorkflow.metadata.annotations.size);
			} catch (error) {
				// throw new Error(`Problem reading input filesizes for dry run - ${dryRunId}`);
				validFileSizes = false;
				let createDryRunMessageModal: ModalSettings;
				createDryRunMessageModal = {
					type: 'alert',
					title: 'Error reading input filesizes for dry run - ${dryRunId}',
					body: 'You will be taken back to the dry runs list on close'
				};
				modalStore.trigger(createDryRunMessageModal);
				await new Promise((resolve) => setTimeout(resolve, 2500));
				modalStore.close();
				goto(`/projects/project_id/${$selectedProject?.id}`);
				return;
			}
		});
		
		const CpuUsageDataPerStep: Record<string, { max: number[], avg: number[] }> = [...allStepNames, ''].reduce((acc, stepName) => ({ ...acc, [stepName]: { max: [], avg: [] } }), {});
		const MemoryUsageDataPerStep: Record<string, { max: number[], avg: number[] }> = [...allStepNames, ''].reduce((acc, stepName) => ({ ...acc, [stepName]: { max: [], avg: [] } }), {});
		
		// combine resource values for the selected dry runs
		dryruns_for_prediction.forEach((dryrunId) => {
			[...allStepNames, ''].forEach((stepName) => {
				const maxCpuUsage = collectedMetrics[dryrunId][stepName]?.CPU.max;
				const avgCpuUsage = collectedMetrics[dryrunId][stepName]?.CPU.avg;
				const maxMemoryUsage = collectedMetrics[dryrunId][stepName]?.Memory.max;
				const avgMemoryUsage = collectedMetrics[dryrunId][stepName]?.Memory.avg;

				if (maxCpuUsage) {								
					CpuUsageDataPerStep[stepName].max.push(maxCpuUsage);
					CpuUsageDataPerStep[stepName].avg.push(avgCpuUsage);
				}
				if(maxMemoryUsage) {
					MemoryUsageDataPerStep[stepName].max.push(maxMemoryUsage);
					MemoryUsageDataPerStep[stepName].avg.push(avgMemoryUsage);
				}
			});
		});		
		const fileSizeData = await Promise.all(fileSizeDataPromise) as number[];
		console.log('filesize stored in metadata annotations')
		console.log(fileSizeData)

		// make predictions with the combined resource values of all selected dry runs
		maxCpuPredictions = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = await linearRegression(fileSizeData, CpuUsageDataPerStep[stepName].max);
			maxCpuPredictions[i] = predictLinearRegression(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});

		avgCpuPredictions = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = await linearRegression(fileSizeData, CpuUsageDataPerStep[stepName].avg);
			avgCpuPredictions[i] = predictLinearRegression(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});
		maxMemPredictions = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = await linearRegression(fileSizeData, MemoryUsageDataPerStep[stepName].max);
			maxMemPredictions[i] = predictLinearRegression(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});
		avgMemPredictions = Array<number>(allStepNames.length + 1).fill(0);
		[...allStepNames, ''].forEach(async (stepName, i) => {
			const r = await linearRegression(fileSizeData, MemoryUsageDataPerStep[stepName].avg);
			avgMemPredictions[i] = predictLinearRegression(valueforPrediction, r.slope, r.intercept).toFixed(3) as unknown as number;
		});

		showPredictions = true;
	};
	let valueforPrediction = 234;
	let showPredictions = false;
	let validFileSizes = true;
	let maxCpuPredictions: number[];
	let avgCpuPredictions:number[];
	let maxMemPredictions: number[];
	let avgMemPredictions:number[];
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		<h1 STYLE="font-size:28px">
			Estimations
			<span STYLE="font-size:28px">based on dryruns {dryruns_for_prediction} </span>
		</h1>
		<br/>

		{#if validFileSizes} 
			<h1 STYLE="font-size:20px">
				Input filesize for prediction:
				<span><input bind:value={valueforPrediction} placeholder="enter in bytes" /> </span>
			</h1>
			<br/>
			<div class="flex justify-between">
				<div class="flex flex-row justify-end p-5 space-x-1">
					<div>
						<button type="button" class="btn btn-sm variant-filled" on:click={getPredictionDetails}>
							<span>Predict</span>
						</button>
					</div>
				</div>
			</div>			
			
			<br/>
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
						<tr>
							<td>CPU Usage</td>
							<td>
								<table class="table">
									<tbody>
										{#each allStepNames as name, i}
											<tr>
												<td>{name}</td>
												<td>{maxCpuPredictions[i]}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{maxCpuPredictions.slice(-1)[0]}</td>
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
												<td>{avgCpuPredictions[i]}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{avgCpuPredictions.slice(-1)[0]}</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
						<tr>
							<td>Memory Usage</td>
							<td>
								<table class="table">
									<tbody>
										{#each allStepNames as name, i}
											<tr>
												<td>{name}</td>
												<td>{filesize(maxMemPredictions[i])}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{filesize(maxMemPredictions.slice(-1)[0])}</td>
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
												<td>{filesize(avgMemPredictions[i])}</td>
											</tr>
										{/each}
										<tr>
											<td class="font-bold">Whole</td>
											<td class="font-bold">{filesize(avgMemPredictions.slice(-1)[0])}</td>
										</tr>
									</tbody>
								</table>
							</td>
						</tr>
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
