<script lang="ts">
	import {
		getMetricsAnalyticsUtils,
		getMetricsResponse,
		getMetricsUsageUtils,
		printReadableBytes,
		type MetricsAnalytics,
		printReadablePercent,
		convertToBytes,
		ALL_UNITS,
		linearRegression
	} from '$utils/resource-utils.js';
	import { selectedProject } from '$stores/stores.js';
	import { goto } from '$app/navigation';
	import getDryRunInputFilesizeQuery from '$queries/get_dry_run_input_filesizes.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { readable_time } from '$lib/time_difference.js';
	import { cForm } from '$styles/styles.js';
	import type { MetricsWithTimeStamps } from '$typesdefinitions';
	import getDryRunProjectIDQuery from '$queries/get_dry_run_project_id.js';
	import { displayAlert } from '$utils/alerts-utils.js';

	export let data;

	let valueforPrediction: number;
	let inputValue: number;
	let inputUnit: string = ALL_UNITS[3];
	let showPredictions = false;
	let maxCpuPredictions: number[];
	let avgCpuPredictions: number[];
	let maxMemPredictions: number[];
	let avgMemPredictions: number[];
	let durationPredictions: string[];

	const dryrunsForPrediction = data.prediction.split(' '); // get the name of the dry-runs to be predicted from the url [prediction]
	let allStepNames: string[];
	const collectedMetrics: {
		[key: string]: MetricsAnalytics;
	} = {};

	async function gotoDryRuns(): Promise<void> {
		let projectId = '';
		if ($selectedProject?.id) projectId = $selectedProject?.id;
		// if selectedproject in store is null, get the project id from any of the selected runs
		else {
			const dryRunId = dryrunsForPrediction[0];
			const result: {
				dryRun: {
					project: { id: string };
				};
			} = await requestGraphQLClient(getDryRunProjectIDQuery, { dryRunId });
			projectId = result.dryRun.project.id;
		}
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		goto(`/projects/dryruns/${projectId}`);
	}

	// for each selected dry run, get the resource analytics (avg, max) per step and per dry run level
	export const getPredictionDetails = async (): Promise<void> => {
		valueforPrediction = convertToBytes(inputValue, inputUnit);
		dryrunsForPrediction.forEach(async (dryRunId) => {
			collectedMetrics[dryRunId] = {};
			let cpuData: { [key: string]: MetricsWithTimeStamps } = {};
			let memoryData: { [key: string]: MetricsWithTimeStamps } = {};
			let networkDataCombined: {
				[key: string]: MetricsWithTimeStamps[];
			} = {};
			const metrics = await getMetricsResponse(dryRunId);
			const result = await getMetricsUsageUtils(metrics);
			cpuData = result.cumulativeCpuData;
			memoryData = result.memoryData;
			networkDataCombined = result.cumulativeNetworkData;
			allStepNames = result.allStepNames;
			const pipelineMetricsAnalytics: MetricsAnalytics = await getMetricsAnalyticsUtils(
				allStepNames,
				metrics,
				cpuData,
				memoryData,
				networkDataCombined
			);
			collectedMetrics[dryRunId] = pipelineMetricsAnalytics;
		});
		// eslint-disable-next-line no-promise-executor-return
		await new Promise((resolve) => setTimeout(resolve, 1500));
		// read and store filesizes stored in the annotations in argoworkflows of the selected dryruns
		// eslint-disable-next-line consistent-return
		const fileSizeDataPromise = dryrunsForPrediction.map(async (dryRunId) => {
			try {
				const response: {
					dryRun: {
						nodes: any;
						project: any;
						argoWorkflow: { metadata: { annotations: any } };
					};
				} = await requestGraphQLClient(getDryRunInputFilesizeQuery, { dryRunId });
				if (!$selectedProject) $selectedProject = response.dryRun.project.id;
				// console.log(dryRunId, response);
				let totalFileSize = 0;
				response.dryRun.nodes.forEach((node: any) => {
					if (node.inputArtifacts) {
						node.inputArtifacts.forEach((artifact: any) => {
							totalFileSize += artifact.size;
						});
					}
				});
				// TODO: change when filesize api is ready
				// return Number(response.dryRun.argoWorkflow.metadata.annotations.filesize); // There is no filesize in annotations!
				return totalFileSize;
			} catch (error) {
				console.log(error);
				const title = `Error reading input filesizes for dry run - ${dryRunId}`;
				const body = 'You will be taken back to the dry runs list on close';
				await displayAlert(title, body, 3500);
				// eslint-disable-next-line @typescript-eslint/no-floating-promises
				goto(`/projects/dryruns/${$selectedProject?.id}`);
			}
		});

		// store combined resource usage for selected dry runs
		const CpuCombined: Record<string, { max: number[]; avg: number[] }> = [
			...allStepNames,
			'Total'
			// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
		].reduce((acc, stepName) => ({ ...acc, [stepName]: { max: [], avg: [] } }), {});
		const MemoryCombined: Record<string, { max: number[]; avg: number[] }> = [
			...allStepNames,
			'Total'
			// eslint-disable-next-line unicorn/no-array-reduce, unicorn/prefer-object-from-entries
		].reduce((acc, stepName) => ({ ...acc, [stepName]: { max: [], avg: [] } }), {});
		const DurationCombined: { [key: string]: number[] } = Object.fromEntries(
			[...allStepNames, 'Total'].map((name) => [name, []])
		);

		// combine resource values for the selected dry runs for each metric to be predicted
		for (const dryrunId of dryrunsForPrediction) {
			for (const stepName of [...allStepNames, 'Total']) {
				CpuCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.CPU.max);
				CpuCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.CPU.avg);
				MemoryCombined[stepName].max.push(collectedMetrics[dryrunId][stepName]?.Memory.max);
				MemoryCombined[stepName].avg.push(collectedMetrics[dryrunId][stepName]?.Memory.avg);
				DurationCombined[stepName].push(collectedMetrics[dryrunId][stepName]?.Duration);
			}
		}

		const fileSizeData = (await Promise.all(fileSizeDataPromise)) as number[];
		console.log('fileSizeData', fileSizeData);
		// await isFileSizeValid(fileSizeData);
		// initialize var to store prediction estimates
		maxCpuPredictions = Array<number>(allStepNames.length + 1).fill(0);
		avgCpuPredictions = Array<number>(allStepNames.length + 1).fill(0);
		maxMemPredictions = Array<number>(allStepNames.length + 1).fill(0);
		avgMemPredictions = Array<number>(allStepNames.length + 1).fill(0);
		durationPredictions = Array<string>(allStepNames.length + 1).fill('');
		// make predictions with the combined resource values of all selected dry runs
		for (const [i, stepName] of [...allStepNames, 'Total'].entries()) {
			maxCpuPredictions[i] = await linearRegression(
				fileSizeData,
				CpuCombined[stepName].max,
				valueforPrediction
			);
			avgCpuPredictions[i] = await linearRegression(
				fileSizeData,
				CpuCombined[stepName].avg,
				valueforPrediction
			);
			maxMemPredictions[i] = await linearRegression(
				fileSizeData,
				MemoryCombined[stepName].max,
				valueforPrediction
			);
			avgMemPredictions[i] = await linearRegression(
				fileSizeData,
				MemoryCombined[stepName].avg,
				valueforPrediction
			);
			durationPredictions[i] = readable_time(
				(await linearRegression(fileSizeData, DurationCombined[stepName], valueforPrediction)) *
					1000
			);
		}
		showPredictions = true;
	};
</script>

<div class="p-10">
	<div class="table-container">
		<h1 class="flex justify-between items-center" STYLE="font-size:24px">
			Estimations based on dryruns {dryrunsForPrediction.join(', ')}
			<span>
				<button type="button" class="justify-end btn btn-sm variant-filled" on:click={gotoDryRuns}>
					<span>Back to dry runs</span>
				</button>
			</span>
		</h1>
		<br />

		<form class="modal-form {cForm}">
			<label class="label">
				<span>Input filesize for prediction</span>
				<div class="flex">
					<input
						class="input"
						type="text"
						bind:value={inputValue}
						placeholder="Enter filesize ..."
					/>
				</div>
				<div class="flex">
					<select class="input" bind:value={inputUnit}>
						{#each ALL_UNITS as unit}
							<option value={unit}>{unit.charAt(0).toUpperCase() + unit.slice(1)}</option>
						{/each}
					</select>
				</div>
			</label>
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
									{#each allStepNames as name, i}
										<tr>
											<td>{name}</td>
											<td>{durationPredictions[i]}</td>
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
									{#each allStepNames as name, i}
										<tr>
											<td>{name}</td>
											<td>{printReadablePercent(maxCpuPredictions[i])}</td>
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
									{#each allStepNames as name, i}
										<tr>
											<td>{name}</td>
											<td>{printReadablePercent(avgCpuPredictions[i])}</td>
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
									{#each allStepNames as name, i}
										<tr>
											<td>{name}</td>
											<td>{printReadableBytes(maxMemPredictions[i])}</td>
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
									{#each allStepNames as name, i}
										<tr>
											<td>{name}</td>
											<td>{printReadableBytes(avgMemPredictions[i])}</td>
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
