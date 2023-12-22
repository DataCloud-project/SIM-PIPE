<script lang="ts">
	import { type ModalSettings, modalStore, Modal } from '@skeletonlabs/skeleton';
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		printReadableBytes,
		type MetricsAnalytics,
		printReadablePercent
	} from '../../../../utils/resource_utils.js';
	import { selectedProject } from '../../../../stores/stores.js';
	import { goto } from '$app/navigation';
	import getDryRunInputFilesizeQuery from '../../../../queries/get_dry_run_input_filesizes.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { readable_time } from '$lib/ti$lib/graphql-utils.js;
	import { cForm } from '../../../../styles/styles.js';

	export let data;

	type metricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

	const dryruns_for_prediction = data.prediction.split(' ');
	let allStepNames: string[];
	var collectedMetrics: {
		[key: string]: MetricsAnalytics;
	} = {};

	async function linearRegression(
		x: number[],
		y: number[]
	): Promise<{ slope: number; intercept: number }> {
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
			return { slope: 0, intercept: 0 };
		}
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
		return { slope, intercept };
	}

	function predictLinearRegression(fileSize: number, slope: number, intercept: number): number {
		return slope * fileSize + intercept;
	}

	// for each selected dry run, get the resource analytics (avg, max) per step and per dry run level
	export const getPredictionDetails = async (): Promise<void> => {
		dryruns_for_prediction.forEach(async (dryRunId) => {
			collectedMetrics[dryRunId] = {};
			const cpuData: { [key: string]: metricsWithTimeStamps } = {};
			const memoryData: { [key: string]: metricsWithTimeStamps } = {};
			const networkDataCombined: {
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
			const pipelineMetricsAnalytics: MetricsAnalytics = {};
			await getMetricsAnalyticsUtils(
				result.allStepNames,
				metrics,
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
				const response: {
					dryRun: {
						nodes: any;
						project: any;
						argoWorkflow: { metadata: { annotations: any } };
					};
				} = await requestGraphQLClient(getDryRunInputFilesizeQuery, { dryRunId });
				if (!$selectedProject) $selectedProject = response.dryRun.project.id;
				// TODO: change when filesize api is ready
				return Number(response.dryRun.argoWorkflow.metadata.annotations.filesize);
			} catch (error) {
				console.log(error);
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
			}
		});

		// store combined resource usage for selected dry runs
		const CpuCombined: Record<string, { max: number[]; avg: number[] }> = Object.fromEntries(
			[...allStepNames, 'Total'].map((stepName) => [stepName, { max: [], avg: [] }])
		);
		const MemoryCombined: Record<string, { max: number[]; avg: number[] }> = Object.fromEntries(
			[...allStepNames, 'Total'].map((stepName) => [stepName, { max: [], avg: [] }])
		);
		const DurationCombined: { [key: string]: number[] } = Object.fromEntries(
			[...allStepNames, 'Total'].map((name) => [name, []])
		);

		// combine resource values for the selected dry runs
		for (const dryrunId of dryruns_for_prediction) {
			for (const stepName of [...allStepNames, 'Total']) {
				CpuCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.CPU.max);
				CpuCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.CPU.avg);
				MemoryCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.Memory.max);
				MemoryCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.Memory.avg);
				DurationCombined[stepName].push(collectedMetrics[dryrunId][stepName]?.Duration);
			}
		}
		const fileSizeData = (await Promise.all(fileSizeDataPromise)) as number[];
		// make predictions with the combined resource values of all selected dry runs
		maxCpuPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0);
		[...allStepNames, 'Total'].forEach(async (stepName, index) => {
			const r = await linearRegression(fileSizeData, CpuCombined[stepName].max);
			maxCpuPredictions[index] = predictLinearRegression(
				valueforPrediction,
				r.slope,
				r.intercept
			).toFixed(3) as unknown as number;
		});
		avgCpuPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0);
		[...allStepNames, 'Total'].forEach(async (stepName, index) => {
			const r = await linearRegression(fileSizeData, CpuCombined[stepName].avg);
			avgCpuPredictions[index] = predictLinearRegression(
				valueforPrediction,
				r.slope,
				r.intercept
			).toFixed(3) as unknown as number;
		});
		maxMemPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0);
		[...allStepNames, 'Total'].forEach(async (stepName, index) => {
			const r = await linearRegression(fileSizeData, MemoryCombined[stepName].max);
			maxMemPredictions[index] = predictLinearRegression(valueforPrediction, r.slope, r.intercept);
		});

		avgMemPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0);
		[...allStepNames, 'Total'].forEach(async (stepName, index) => {
			const r = await linearRegression(fileSizeData, MemoryCombined[stepName].avg);
			avgMemPredictions[index] = predictLinearRegression(
				valueforPrediction,
				r.slope,
				r.intercept
			).toFixed(3) as unknown as number;
		});
		durationPredictions = Array.from({ length: allStepNames.length + 1 }).fill('');
		[...allStepNames, 'Total'].forEach(async (stepName, index) => {
			const r = await linearRegression(fileSizeData, DurationCombined[stepName]);
			durationPredictions[index] = readable_time(
				(predictLinearRegression(valueforPrediction, r.slope, r.intercept) *
					1000) as unknown as number
			);
		});
		showPredictions = true;
	};
	let valueforPrediction: number = 11_000;
	let showPredictions = false;
	let validFileSizes = true;
	let maxCpuPredictions: number[];
	let avgCpuPredictions: number[];
	let maxMemPredictions: number[];
	let avgMemPredictions: number[];
	let durationPredictions: string[];
</script>

<div class="p-10">
	<div class="table-container">
		<h1 class="flex justify-between items-center" STYLE="font-size:24px">
			Estimations based on dryruns {dryruns_for_prediction.join(', ')}
			<span>
				<button
					type="button"
					class="justify-end btn btn-sm variant-filled"
					on:click={() => goto(`/projects/project_id/${$selectedProject?.id}`)}
				>
					<span>Back to dry runs</span>
				</button>
			</span>
		</h1>
		<br />

		<form class="modal-form {cForm}">
			<label class="label">
				<span>Input filesize for prediction</span>
				<div class="flex w-half">
					<input
						class="input"
						type="text"
						bind:value={valueforPrediction}
						placeholder="Enter name..."
					/>
				</div></label
			>
			<button type="button" class="btn btn-sm variant-filled" on:click={getPredictionDetails}>
				<span>Predict</span>
			</button>
		</form>
		<br />

		<br />
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
						<td>Duration</td>
						<td>
							<table class="table">
								<tbody>
									{#each allStepNames as name, index}
										<tr>
											<td>{name}</td>
											<td>{durationPredictions[index]}</td>
										</tr>
									{/each}
									<tr>
										<td class="font-bold">Total</td>
										<td class="font-bold">{durationPredictions.at(-1)}</td>
									</tr>
								</tbody>
							</table>
						</td>
						<td> - </td>
					</tr>

					<tr>
						<td>CPU Usage</td>
						<td>
							<table class="table">
								<tbody>
									{#each allStepNames as name, index}
										<tr>
											<td>{name}</td>
											<td>{printReadablePercent(maxCpuPredictions[index])}</td>
										</tr>
									{/each}
									<tr>
										<td class="font-bold">Total</td>
										<td class="font-bold">{printReadablePercent(maxCpuPredictions.at(-1))}</td>
									</tr>
								</tbody>
							</table>
						</td>

						<td>
							<table class="table">
								<tbody>
									{#each allStepNames as name, index}
										<tr>
											<td>{name}</td>
											<td>{printReadablePercent(avgCpuPredictions[index])}</td>
										</tr>
									{/each}
									<tr>
										<td class="font-bold">Total</td>
										<td class="font-bold">{printReadablePercent(avgCpuPredictions.at(-1))}</td>
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
									{#each allStepNames as name, index}
										<tr>
											<td>{name}</td>
											<td>{printReadableBytes(maxMemPredictions[index])}</td>
										</tr>
									{/each}
									<tr>
										<td class="font-bold">Total</td>
										<td class="font-bold">{printReadableBytes(maxMemPredictions.at(-1))}</td>
									</tr>
								</tbody>
							</table>
						</td>

						<td>
							<table class="table">
								<tbody>
									{#each allStepNames as name, index}
										<tr>
											<td>{name}</td>
											<td>{printReadableBytes(avgMemPredictions[index])}</td>
										</tr>
									{/each}
									<tr>
										<td class="font-bold">Total</td>
										<td class="font-bold">{printReadableBytes(avgMemPredictions.at(-1))}</td>
									</tr>
								</tbody>
							</table>
						</td>
					</tr>
				</tbody>
			</table>
		{/if}
	</div>
</div>

<Modal />
