<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar, CodeBlock } from '@skeletonlabs/skeleton';
	import { AlertTriangleIcon, ZoomInIcon } from 'svelte-feather-icons';
	import { filesize } from 'filesize';
	import getDryRunMetricsQuery from '$queries/get_dry_run_metrics.js';
	import getProjectQuery from '$queries/get_project';
	import getDryRunPhaseResultsQuery from '$queries/get_dry_run_phase_results';
	import getDryRunQuery from '$queries/get_selected_project';
	import getCarbontrackerDataQuery from '$queries/get_carbontracker_metrics';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';
	import Plot from './plot.svelte';
	import Mermaid from './mermaid.svelte';
	import { colors } from './Config.js';
	import { stepsList, selectedProjectName, selectedDryRunName } from '$stores/stores';
	import Legend from './legend.svelte';
	import {
		getMetricsUsageUtils,
		getMetricsAnalyticsUtils,
		displayStepDuration
	} from '$utils/resource-utils';
	import type { MetricsAnalytics } from '$utils/resource-utils';
	// import { displayAlert } from '$utils/alerts-utils';
	import type { DryRunMetrics, DryRun, MetricsWithTimeStamps } from '$typesdefinitions';

	// Extended type to include carbontracker data
	interface ExtendedDryRunMetrics extends DryRunMetrics {
		carbontracker?: {
			fetchCarbontrackerData?: {
				co2eq: number;
				energy: number;
			};
		};
	}

	export let data;

	let loadingFinished = false;
	let workflow: { workflowTemplates: { argoWorkflowTemplate: { spec: { templates: any[] } } }[] };
	const dryRunPhases: { [x: string]: string } = {};
	const graphOrientation = 'LR';

	let mermaidCode = [];
	let diagram: string;
	$: diagram = diagram;
	let selectedProject: { name: string; id: string };
	let logs: { [x: string]: string } = {};

	let cumulativeCpuData: { [key: string]: MetricsWithTimeStamps } = {};
	let currentCpuData: { [key: string]: MetricsWithTimeStamps } = {};
	let memoryData: { [key: string]: MetricsWithTimeStamps } = {};
	let cumulativeNetworkData: {
		[key: string]: MetricsWithTimeStamps[];
	} = {};
	let currentNetworkData: {
		[key: string]: MetricsWithTimeStamps[];
	} = {};

	let allStepNames: string[] = [];

	$: selectedStep = 'Total';
	let reactiveStepsList: ExtendedDryRunMetrics[];
	$: reactiveStepsList = ($stepsList as ExtendedDryRunMetrics[]) || [];

	function gotoOverview(): void {
		selectedStep = 'Total';
	}

	let maxCpu = 'N/A';
	let maxMemory = 'N/A';
	function findMax(input: number[]): number {
		if (input?.length === 0) return 0;
		return Math.max(...input);
	}

	let averageCpu = 'N/A';
	let averageMemory = 'N/A';
	function computeAverage(input: number[]): number {
		if (input?.length === 0) return 0;
		return input.reduce((a, b) => a + b) / input.length;
	}

	let networkTotalReceived = 'N/A';
	let networkTotalTransmitted = 'N/A';
	let pipelineDuration = 'N/A';
	let totalCO2 = 'N/A';
	let totalEnergy = 'N/A';

	function formatDuration(seconds: number): string {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		let durationString = '';
		if (hours > 0) {
			durationString += `${hours}h `;
		}
		if (minutes > 0) {
			durationString += `${minutes}m `;
		}
		if (remainingSeconds > 0) {
			durationString += `${remainingSeconds}s`;
		}

		return durationString.trim();
	}

	function computePipelineDuration(): void {
		let totalDuration = 0;
		if (reactiveStepsList) {
			if (selectedStep === 'Total') {
				reactiveStepsList?.forEach((step) => {
					totalDuration += step.duration;
				});
			} else {
				totalDuration = reactiveStepsList.find((step) => step.displayName === selectedStep)
					?.duration as number;
			}
		}
		pipelineDuration = formatDuration(totalDuration);
	}

	function computeTotalCarbonMetrics(): void {
		let co2Sum = 0;
		let energySum = 0;

		if (reactiveStepsList) {
			reactiveStepsList.forEach((step) => {
				if (step.carbontracker?.fetchCarbontrackerData) {
					if (step.carbontracker.fetchCarbontrackerData.co2eq) {
						co2Sum += step.carbontracker.fetchCarbontrackerData.co2eq;
					}
					if (step.carbontracker.fetchCarbontrackerData.energy) {
						energySum += step.carbontracker.fetchCarbontrackerData.energy;
					}
				}
			});
		}

		totalCO2 = co2Sum > 0 ? co2Sum.toFixed(3) : 'N/A';
		totalEnergy = energySum > 0 ? energySum.toFixed(6) : 'N/A';
	}

	// Reactive statement to compute carbon metrics when reactiveStepsList changes
	$: if (reactiveStepsList && reactiveStepsList.length > 0) {
		computeTotalCarbonMetrics();
	}

	let dryRunPhaseMessage: string | null;
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, consistent-return
	const getMetricsResponse = async (): Promise<DryRunMetrics[]> => {
		const dryrunVariables = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			dryRunId: data.resource
		};
		try {
			const response: { dryRun: { nodes: []; status: { message: string } } } =
				await requestGraphQLClient(getDryRunMetricsQuery, dryrunVariables);
			dryRunPhaseMessage = response?.dryRun?.status?.message;
			return response?.dryRun?.nodes.filter((node) => Object.keys(node).length > 0);
		} catch (error) {
			const title = 'Internal error!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
			return [];
		}
	};

	async function getCarbontrackerDataResponse(input: any): Promise<
		| {
				fetchCarbontrackerData?: {
					co2eq: number;
					energy: number;
				};
		  }
		| undefined
	> {
		const inputData = {
			input: {
				data: {
					dryRun: {
						node: {
							metrics: {
								cpuUsageSecondsTotal: input
							}
						}
					}
				}
			}
		};
		console.log('inputData:', inputData);
		try {
			const response = await requestGraphQLClient(getCarbontrackerDataQuery, inputData);
			return response as {
				fetchCarbontrackerData?: {
					co2eq: number;
					energy: number;
				};
			};
		} catch (error) {
			const title = 'Internal error!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
			return undefined;
		}
	}

	const getData = async (): Promise<{
		workflow: any;
		dryrun: any;
		metrics: any;
		allstepnames: string[];
	}> => {
		const selectedProjectResponse = await requestGraphQLClient<{
			dryRun?: { project: { name: string; id: string } };
		}>(getDryRunQuery, {
			dryRunId: data.resource
		});
		if (!selectedProjectResponse.dryRun?.project) {
			throw new Error('Project not found');
		}
		selectedProject = selectedProjectResponse.dryRun?.project;
		selectedProjectName.set(selectedProject?.name);
		const workflowVariables = {
			// name: selectedProject?.name
			projectId: selectedProject?.id
		};
		const dryrunVariables = {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			dryRunId: data.resource
		};
		selectedDryRunName.set(data.resource);
		const workflowResponse = await requestGraphQLClient<any>(getProjectQuery, workflowVariables);

		const dryrunResponse: { dryRun: DryRun } = await requestGraphQLClient(
			getDryRunPhaseResultsQuery,
			dryrunVariables
		);
		// set stepsList as nodes
		$stepsList = dryrunResponse.dryRun.nodes;
		// filter out all nodes which are not of type Pod
		$stepsList = $stepsList.filter((item) => item.type === 'Pod');
		dryrunResponse.dryRun.nodes.forEach((node: DryRunMetrics) => {
			dryRunPhases[node.displayName] = node.phase;
		});

		const metricsResponse = await getMetricsResponse();

		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		selectedProjectName.set;

		const result = await getMetricsUsageUtils(metricsResponse as unknown as DryRunMetrics[]);
		const { allStepNames } = result;
		// console.log('allStepNames:', allStepNames);
		cumulativeCpuData = result.cumulativeCpuData;
		currentCpuData = result.currentCpuData;
		memoryData = result.memoryData;
		cumulativeNetworkData = result.cumulativeNetworkData;
		currentNetworkData = result.currentNetworkData;
		logs = result.logs;
		const carbontrackerData: Array<{
			nodeId: string;
			stepName: string;
			carbonData: { fetchCarbontrackerData?: { co2eq: number; energy: number } } | undefined;
		}> = [];
		for (const step of metricsResponse) {
			if (step.type === 'Pod') {
				const carbonResponse = await getCarbontrackerDataResponse(
					step.metrics.cpuUsageSecondsTotal
				);
				carbontrackerData.push({
					nodeId: step.id,
					stepName: step.displayName,
					carbonData: carbonResponse
				});
			}
		}

		// Merge carbontracker data with stepsList
		$stepsList = $stepsList.map((step) => {
			const carbonData = carbontrackerData.find((carbon) => carbon.nodeId === step.id);
			return {
				...step,
				carbontracker: carbonData ? carbonData.carbonData : undefined
			};
		});

		const responses = {
			workflow: workflowResponse.project,
			dryrun: dryrunResponse,
			metrics: metricsResponse,
			allstepnames: allStepNames,
			selectedDryRunName: $selectedDryRunName,
			carbontrackerData
		};

		console.log('responses:', responses);
		return responses;
	};

	function truncateString(word: string, maxLength: number): string {
		if (word.length > maxLength) {
			return `${word.slice(0, maxLength)}..`;
		}
		return word;
	}

	function generateRandomString(): string {
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

	function argoStepsToMermaid(argoWorkflow: any): void {
		let previousStep = '';
		for (const stepList of argoWorkflow) {
			for (const parallellStep of stepList) {
				const stepName = parallellStep.name;
				mermaidCode.push(
					`  ${stepName}["${truncateString(stepName, 12)}"];`,
					`  click ${stepName} href "javascript:console.log('task ${stepName}');"`,
					`  style ${stepName} fill:${colors[dryRunPhases[stepName] as keyof typeof colors]}`
				);
			}
			// eslint-disable-next-line unicorn/no-negated-condition
			if (previousStep !== '') {
				if (stepList.length > 1) {
					const subgraphName = `parallel-${generateRandomString()}`;
					mermaidCode.push(`  subgraph ${subgraphName}`);
					for (const step of stepList) {
						const stepName = step.name;
						mermaidCode.push(`    ${stepName};`);
					}
					mermaidCode.push(`  end`, `  ${previousStep} --> ${subgraphName};`);
					previousStep = subgraphName;
				} else {
					for (const step of stepList) {
						const stepName = step.name;
						if (previousStep !== '') {
							mermaidCode.push(`    ${previousStep} --> ${stepName};`);
						}
						previousStep = stepName;
					}
				}
			} else {
				const stepName = stepList[0].name;
				previousStep = stepName;
			}
		}
	}

	function argoDAGtoMermaid(argoWorkflow: { tasks: any[] }): void {
		argoWorkflow.tasks.forEach((task) => {
			const taskName = task.name;
			const dependencies = task.dependencies || [];
			const depends = task.depends || '';

			mermaidCode.push(
				`  ${taskName}["${truncateString(taskName, 12)}"];`,
				`  click ${taskName} href "javascript:console.log('task ${taskName}');"`,
				`  style ${taskName} fill:${colors[dryRunPhases[taskName] as keyof typeof colors]}`
			);
			for (const depTask of dependencies) {
				mermaidCode.push(`  ${depTask} --> ${taskName};`);
			}
			if (depends) {
				depends.split(' ').forEach((dep: string) => {
					if (!['&&', '||', '!'].includes(dep)) {
						mermaidCode.push(`  ${dep} --> ${taskName};`);
					}
				});
			}
		});
	}

	async function buildDiagram(): Promise<boolean> {
		let diagramFinished = false;
		mermaidCode = []; // clear mermaidCode
		mermaidCode.push(`graph ${graphOrientation};`);
		// console.log('buildDiagram workflow:', workflow);
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		workflow.workflowTemplates[0]?.argoWorkflowTemplate?.spec?.templates?.forEach(
			// eslint-disable-next-line @typescript-eslint/no-misused-promises
			async (template) => {
				try {
					if (template.dag) argoDAGtoMermaid(template.dag);
					else if (template.steps) argoStepsToMermaid(template.steps);
				} catch (error) {
					console.log(error);
					const title = 'Error displaying dry run step diagram❌!';
					const body = `${(error as Error).message}`;
					// await displayAlert(title, body, 5000);
					console.log(title, body);
					// eslint-disable-next-line @typescript-eslint/no-floating-promises
					goto(`/projects/dryruns/${selectedProject?.id}`);
				}
			}
		);
		diagram = mermaidCode.join('\n');
		diagramFinished = true;
		return diagramFinished;
	}

	function stepOnClick(stepName: string): void {
		selectedStep = stepName;
		computePipelineDuration();
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	$: getLogs = () => {
		let returnValue = [];
		returnValue = selectedStep === 'Total' ? allStepNames : [selectedStep];
		return returnValue;
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	$: getResource = (resource: string) => {
		const data: { x: string[]; y: number[]; type: string; name: string }[] = [];
		switch (resource) {
			case 'cpu-cumulative': {
				if (Object.keys(cumulativeCpuData).length > 0) {
					if (selectedStep === 'Total') {
						allStepNames.forEach((step) => {
							if (cumulativeCpuData[step]) data.push(cumulativeCpuData[step]);
						});
					} else {
						data.push(cumulativeCpuData[selectedStep]);
					}
				}
				break;
			}
			case 'cpu-current': {
				if (Object.keys(currentCpuData).length > 0)
					if (selectedStep === 'Total') {
						const maxCpuList: number[] = [];
						const avgCpulist: number[] = [];
						allStepNames.forEach((step) => {
							if (currentCpuData[step]) {
								data.push(currentCpuData[step]);
								maxCpuList.push(findMax(currentCpuData[step].y));
								avgCpulist.push(computeAverage(currentCpuData[step].y));
							}
						});
						maxCpu = findMax(maxCpuList).toFixed(2).toString();
						averageCpu = computeAverage(avgCpulist).toFixed(2).toString();
					} else {
						data.push(currentCpuData[selectedStep]);
						maxCpu = findMax(currentCpuData[selectedStep].y).toFixed(2).toString();
						averageCpu = computeAverage(currentCpuData[selectedStep].y).toFixed(2).toString();
					}
				break;
			}
			case 'memory': {
				if (Object.keys(memoryData).length > 0)
					if (selectedStep === 'Total') {
						const maxMemoryList: number[] = [];
						const avgMemoryList: number[] = [];
						allStepNames.forEach((step) => {
							if (memoryData[step]) {
								data.push(memoryData[step]);
								maxMemoryList.push(findMax(memoryData[step].y));
								avgMemoryList.push(computeAverage(memoryData[step].y));
							}
						});
						maxMemory = filesize(findMax(maxMemoryList), { round: 2 });
						averageMemory = filesize(computeAverage(avgMemoryList), { round: 2 });
					} else {
						data.push(memoryData[selectedStep]);
						maxMemory = filesize(findMax(memoryData[selectedStep].y), { round: 2 });
						averageMemory = filesize(computeAverage(memoryData[selectedStep].y), { round: 2 });
					}
				break;
			}
			case 'network-cumulative': {
				if (Object.keys(cumulativeNetworkData).length > 0)
					if (selectedStep === 'Total') {
						allStepNames.forEach((step) => {
							cumulativeNetworkData[step].forEach((networkData) => {
								data.push(networkData);
							});
						});
					} else {
						cumulativeNetworkData[selectedStep].forEach((networkData) => {
							data.push(networkData);
						});
					}
				break;
			}
			case 'network-current': {
				if (Object.keys(currentNetworkData).length > 0) {
					let networkReceived = 0;
					let networkTransmitted = 0;
					if (selectedStep === 'Total') {
						allStepNames.forEach((step) => {
							currentNetworkData[step].forEach((networkData) => {
								data.push(networkData);
								const networkSendReceiveType = networkData.name.split('-')[1];
								if (networkSendReceiveType === 'received') {
									networkData.y.forEach((value) => {
										networkReceived += value;
									});
								}
								if (networkSendReceiveType === 'transmitted') {
									networkData.y.forEach((value) => {
										networkTransmitted += value;
									});
								}
							});
						});
					} else {
						currentNetworkData[selectedStep].forEach((networkData) => {
							data.push(networkData);
							const networkSendReceiveType = networkData.name.split('-')[1];
							if (networkSendReceiveType === 'received') {
								networkData.y.forEach((value) => {
									networkReceived += value;
								});
							}
							if (networkSendReceiveType === 'transmitted') {
								networkData.y.forEach((value) => {
									networkTransmitted += value;
								});
							}
						});
					}
					networkTotalReceived = filesize(networkReceived, { round: 2 });
					networkTotalTransmitted = filesize(networkTransmitted, { round: 2 });
				}
				break;
			}
			default: {
				throw new Error('Invalid resource');
			}
		}
		return selectedStep === 'Total'
			? { title: `- entire dry run`, data }
			: { title: `${selectedStep}`, data };
	};

	onMount(async () => {
		const getDataResponse = await getData();
		workflow = getDataResponse.workflow;
		allStepNames = getDataResponse.allstepnames;
		await buildDiagram();
		computePipelineDuration();
		loadingFinished = true;
	});

	function getPartLogs(stepName: string, nmaxlinelength: number): string {
		const steplogs = logs[stepName];
		// console.log('stepName:', stepName);
		// console.log('steplogs:', steplogs);
		// eslint-disable-next-line unicorn/prefer-ternary
		if (steplogs.length < nmaxlinelength) return steplogs;
		// eslint-disable-next-line no-else-return
		else return `${steplogs.slice(0, nmaxlinelength)}...`;
	}
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#if !loadingFinished}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:else}
			<h1>
				<a href="/projects">Projects</a>
				<span STYLE="font-size:14px">/ </span>
				<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
				<button on:click={() => goto(`/projects/dryruns/${selectedProject?.id}`)}
					>{selectedProject?.name}
				</button>
				<span STYLE="font-size:14px">/ </span>
				<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
				<button on:click={() => gotoOverview()}>{data.resource} </button>
				{#if selectedStep !== 'Total'}
					<span STYLE="font-size:14px">/ </span>{selectedStep}
				{/if}
				<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
				<button
					type="button"
					class="btn-icon btn-icon-sm"
					on:click={() => goto(`/projects/dryruns/${data.resource}/${data.resource}/cpu`)}
					><ZoomInIcon /></button
				>
			</h1>
			<div class="grid grid-flow-rows grid-cols-1 items-center w-full p-5">
				<div>
					<Mermaid {diagram} />
				</div>
				<div>
					<Legend />
				</div>
				<div class="p-5">
					<table class="table table-interactive">
						<thead>
							<tr>
								<th>Name</th>
								<th>Started</th>
								<th>Finished</th>
								<th>Duration</th>
								<th>CO2 [<span class="lowercase">g</span>]</th>
								<th>Energy [<span class="lowercase">k</span>Wh]</th>
								<th>Status</th>
								<th>Output</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
								<tr on:click={() => stepOnClick(step.displayName)}>
									<td style="width:15%">{step.displayName}</td>
									<td style="width:15%">
										{step.startedAt ?? '-'}
									</td>
									<td style="width:15%">
										{step.finishedAt ?? '-'}
									</td>
									<td style="width:10%">{displayStepDuration(step)}</td>
									<td style="width:10%">
										{#if step.carbontracker?.fetchCarbontrackerData?.co2eq}
											{step.carbontracker.fetchCarbontrackerData.co2eq.toFixed(3)}
										{:else}
											-
										{/if}
									</td>
									<td style="width:10%">
										{#if step.carbontracker?.fetchCarbontrackerData?.energy}
											{step.carbontracker.fetchCarbontrackerData.energy.toFixed(6)}
										{:else}
											-
										{/if}
									</td>
									<td style="width:10%">{step.phase}</td>
									<td style="width:15%">
										{#if step.outputArtifacts?.length > 1}
											{#each step.outputArtifacts as artifact}
												{#if artifact.name !== 'main-logs'}
													<a href={step.outputArtifacts[0].url}>{step.outputArtifacts[0].name}* </a>
												{/if}
											{/each}
										{:else}
											<p>-</p>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<div class="grid grid-rows-4 grid-cols-2 gap-5 auto-rows-min">
				<!-- if the logs are empty, remove logs sections -->
				{#if Object.values(logs).join('') !== ''}
					<div class="card mainlogcard row-span-4 p-5">
						<!-- display if the dryrun has a non-empty phase message from argo (usually null if no error) -->
						{#if dryRunPhaseMessage}
							<div class="card logcard row-span-1 p-5">
								<div style="display: flex; align-items: center; color: red; gap: 5px">
									<AlertTriangleIcon />
									<h1>Error Message</h1>
								</div>
								<section class="p-1">
									<div class="w-full">
										<CodeBlock language="json" code={dryRunPhaseMessage} />
									</div>
								</section>
							</div>
						{/if}
						<header class="card-header"><h1>Logs</h1></header>
						<section class="p-1">
							<br />
							<ul class="list">
								{#each getLogs() as key}
									<li>
										<h2>{key}</h2>
									</li>
									<li>
										{#if logs[key] && getPartLogs(key, 20_000)}
											<div class="logbox w-full">
												<CodeBlock language="bash" code={getPartLogs(key, 20_000)} />
											</div>
										{:else}
											<p>No logs</p>
										{/if}
									</li>
									<br />
								{/each}
							</ul>
						</section>
					</div>
				{/if}

				<div class="card resourcecard">
					<table class="table table-interactive">
						<thead>
							<tr>
								<th>Resource</th>
								<th>Metrics</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>CPU</td>
								<td>{maxCpu} % [ max ] {averageCpu} % [ avg ]</td>
							</tr>
							<tr>
								<td>Memory</td>
								<td>{maxMemory} [ max ] {averageMemory} [ avg ]</td>
							</tr>
							<tr>
								<td>Network received</td>
								<td> {networkTotalReceived} </td>
							</tr>
							<tr>
								<td>Network transmitted</td>
								<td> {networkTotalTransmitted} </td>
							</tr>
							<tr>
								<td>Duration</td>
								<td> {pipelineDuration} </td>
							</tr>
							<tr>
								<td>Total CO2</td>
								<td> {totalCO2} g </td>
							</tr>
							<tr>
								<td>Total Energy</td>
								<td> {totalEnergy} kWh </td>
							</tr>
						</tbody>
					</table>
				</div>

				<div class="card plotcard">
					<Plot
						data={getResource('cpu-current').data}
						plotTitle={`CPU Utilization ${getResource('cpu-current').title}`}
						xaxisTitle="time"
						yaxisTitle="cpu utilization %"
					/>
				</div>
				<div class="card plotcard">
					<Plot
						data={getResource('memory').data}
						plotTitle={`Memory Usage ${getResource('memory').title}`}
						xaxisTitle="time"
						yaxisTitle="bytes"
					/>
				</div>
				<div class="card plotcard">
					<Plot
						data={getResource('network-current').data}
						plotTitle={`Network ${getResource('network-current').title}`}
						xaxisTitle="time"
						yaxisTitle="bytes"
					/>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	.card.plotcard {
		display: grid;
		place-items: start;
		max-height: 50vh;
	}
	.card.resourcecard {
		overflow-y: scroll;
		overflow-x: scroll;
		min-height: 25rem;
		max-height: fit-content;
	}
	.card.mainlogcard {
		overflow-y: scroll;
		overflow-x: scroll;
		max-height: 200vh;
	}
	.card.logcard {
		overflow-y: scroll;
		max-height: fit-content;
	}
	.logbox {
		overflow-y: scroll;
		max-height: 50vh;
	}
	ul {
		max-height: 75vh;
		max-height: fit-content;
	}
</style>
