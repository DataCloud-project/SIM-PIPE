<script lang="ts">
	import { getModalStore, Modal, type ModalSettings } from '@skeletonlabs/skeleton';

	import { goto } from '$app/navigation';
	import { requestGraphQLClient } from '$lib/graphql-utils.js';
	import { readableTime } from '$lib/time-difference.js';

	import getDryRunInputFilesizeQuery from '../../../../queries/get-dry-run-input-filesizes.js';
	import { selectedProject } from '../../../../stores/stores.js';
	import { cForm } from '../../../../styles/styles.js';
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		type MetricsAnalytics,
		printReadableBytes,
		printReadablePercent
	} from '../../../../utils/resource_utils.js';
	import type { DryRun } from '../../../../types.js';

	export let data: { prediction?: string };

	const modalStore = getModalStore();
	let valueforPrediction: number = 11_000;
	let showPredictions = false;
	let maxCpuPredictions: number[];
	let avgCpuPredictions: number[];
	let maxMemPredictions: number[];
	let avgMemPredictions: number[];
	let durationPredictions: string[];

	type MetricsWithTimeStamps = { x: string[]; y: number[]; type: string; name: string };

	const dryrunsForPrediction = data.prediction?.split(' ') ?? [];

	let allStepNames: string[];
	const collectedMetrics: {
		[key: string]: MetricsAnalytics;
	} = {};

	function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
		// Check if all x values are the same
		if (new Set(x).size === 1) {
			throw new Error(
				`All filesize values are the same. Unable to perform linear regression.\n Filesizes for prediction are ${x.join(
					','
				)}`
			);
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
		try {
			await Promise.all(
				dryrunsForPrediction.map(async (dryRunId) => {
					collectedMetrics[dryRunId] = {};
					const cpuData: { [key: string]: MetricsWithTimeStamps } = {};
					const memoryData: { [key: string]: MetricsWithTimeStamps } = {};
					const networkDataCombined: {
						[key: string]: MetricsWithTimeStamps[];
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
				})
			);
			await new Promise((resolve) => {
				setTimeout(resolve, 1500);
			});
			// read and store filesizes stored in the annotations in argoworkflows of the selected dryruns
			const fileSizeDataPromise = dryrunsForPrediction.map(async (dryRunId): Promise<number> => {
				try {
					const response = await requestGraphQLClient<{
						dryRun: DryRun;
					}>(getDryRunInputFilesizeQuery, { dryRunId });
					// TODO is this necessary?
					if (!$selectedProject) $selectedProject = response.dryRun.project;
					// TODO: change when filesize api is ready
					// @ts-expect-error we do not have metadata.annotations.filesize
					// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
					return Number(response.dryRun.argoWorkflow.metadata.annotations.filesize);
				} catch {
					throw new Error(`Problem reading input filesizes for dry run - ${dryRunId}`);
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
			for (const dryrunId of dryrunsForPrediction) {
				for (const stepName of [...allStepNames, 'Total']) {
					CpuCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.CPU.max);
					CpuCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.CPU.avg);
					MemoryCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.Memory.max);
					MemoryCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.Memory.avg);
					DurationCombined[stepName].push(collectedMetrics[dryrunId][stepName]?.Duration);
				}
			}
			const fileSizeData = await Promise.all(fileSizeDataPromise);
			// make predictions with the combined resource values of all selected dry runs
			maxCpuPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0) as number[];
			for (const [index, stepName] of [...allStepNames, 'Total'].entries()) {
				const r = linearRegression(fileSizeData, CpuCombined[stepName].max);
				maxCpuPredictions[index] = predictLinearRegression(
					valueforPrediction,
					r.slope,
					r.intercept
				).toFixed(3) as unknown as number;
			}
			avgCpuPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0) as number[];
			for (const [index, stepName] of [...allStepNames, 'Total'].entries()) {
				const r = linearRegression(fileSizeData, CpuCombined[stepName].avg);
				avgCpuPredictions[index] = predictLinearRegression(
					valueforPrediction,
					r.slope,
					r.intercept
				).toFixed(3) as unknown as number;
			}
			maxMemPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0) as number[];
			for (const [index, stepName] of [...allStepNames, 'Total'].entries()) {
				const r = linearRegression(fileSizeData, MemoryCombined[stepName].max);
				maxMemPredictions[index] = predictLinearRegression(
					valueforPrediction,
					r.slope,
					r.intercept
				);
			}

			avgMemPredictions = Array.from({ length: allStepNames.length + 1 }).fill(0) as number[];
			for (const [index, stepName] of [...allStepNames, 'Total'].entries()) {
				const r = linearRegression(fileSizeData, MemoryCombined[stepName].avg);
				avgMemPredictions[index] = predictLinearRegression(
					valueforPrediction,
					r.slope,
					r.intercept
				).toFixed(3) as unknown as number;
			}
			durationPredictions = Array.from({ length: allStepNames.length + 1 }).fill('') as string[];
			for (const [index, stepName] of [...allStepNames, 'Total'].entries()) {
				const r = linearRegression(fileSizeData, DurationCombined[stepName]);
				durationPredictions[index] = readableTime(
					(predictLinearRegression(valueforPrediction, r.slope, r.intercept) *
						1000) as unknown as number
				);
			}
			showPredictions = true;
		} catch (error) {
			// console.log(error);
			const createDryRunMessageModal: ModalSettings = {
				type: 'alert',
				title: 'Error predicting resource usage',
				body: (error as Error).message ?? 'Unknown error'
			};
			modalStore.trigger(createDryRunMessageModal);
			await new Promise((resolve) => {
				setTimeout(resolve, 2500);
			});
			modalStore.close();
			await goto(`/projects/project_id/${$selectedProject?.id}`);
		}
	};
</script>

<div class="p-10">
	<div class="table-container">
		<h1 class="flex justify-between items-center" STYLE="font-size:24px">
			Estimations based on dryruns {dryrunsForPrediction.join(', ')}
			<span>
				<a
					class="justify-end btn btn-sm variant-filled"
					href={`/projects/project_id/${$selectedProject?.id}`}
				>
					<span>Back to dry runs</span>
				</a>
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
