<script lang="ts">
	import { CodeBlock, ProgressBar } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { ZoomInIcon } from 'svelte-feather-icons';

	import { requestGraphQLClient } from '$lib/graphql-utils';

	import getDryRunMetricsQuery from '../../../../../queries/get-dry-run-metrics.js';
	import getDryRunNoLogsMetricsQuery from '../../../../../queries/get-dry-run-metrics-no-logs.js';
	import getDryRunPhaseResultsQuery from '../../../../../queries/get-dry-run-phase-results';
	import getProjectQuery from '../../../../../queries/get-project';
	import getDryRunQuery from '../../../../../queries/get-selected-project';
	import { selectedDryRunName, selectedProjectName, stepsList } from '../../../../../stores/stores';
	import {
		displayStepDuration,
		generateRandomString,
		getMetricsAnalyticsUtils,
		getMetricsUsageUtils,
		truncateString
	} from '../../../../../utils/resource-utils';
	import colors from './colors.js';
	import Legend from './Legend.svelte';
	import Mermaid from './Mermaid.svelte';
	import Plot from './Plot.svelte';
	import type {
		ArgoWorkflowDag,
		ArgoWorkflowStep,
		DryRun,
		DryRunMetrics,
		Project
	} from '../../../../../types';
	import type { MetricsAnalytics } from '../../../../../utils/resource-utils';

	export let data: { resource: string };
	let workflow: Pick<Project, 'workflowTemplates'>;
	let selectStepName = 'Total';
	const dryRunPhases: { [x: string]: string } = {};
	const graphOrientation = 'LR';

	$: selectedStep = selectStepName;
	$: reactiveStepsList = $stepsList;

	let mermaidCode = [];
	let diagram: string;
	$: diagram = diagram;
	let selectedProject: { name: string; id: string };
	let showLogs = true;
	const logs: { [x: string]: string } = {};

	const cpuData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	const memoryData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } =
		{};
	const networkDataCombined: {
		[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
	} = {};

	const pipelineMetricsAnalytics: MetricsAnalytics = {};

	let allStepNames: string[] = [];

	let showMax = true;
	const getMetricsResponse = async (): Promise<DryRunMetrics[]> => {
		const dryrunVariables = {
			dryRunId: data.resource
		};
		try {
			const response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
				getDryRunMetricsQuery,
				dryrunVariables
			);
			return response?.dryRun?.nodes.filter((node) => Object.keys(node).length > 0);
		} catch (error) {
			// internal server error from graphql API when requesting logs for dry runs which has no logs
			if ((error as Error).message.includes('No logs found:')) {
				showLogs = false;
				const response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
					getDryRunNoLogsMetricsQuery,
					dryrunVariables
				);
				return response?.dryRun?.nodes.filter((node) => Object.keys(node).length > 0);
			}
			throw error;
		}
	};

	const getData = async (): Promise<{
		workflow: Pick<Project, 'workflowTemplates'>;
		dryrun: DryRun;
		metrics: DryRunMetrics[];
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
			dryRunId: data.resource
		};
		selectedDryRunName.set(data.resource);
		const workflowResponse = await requestGraphQLClient<{
			project: Project;
		}>(getProjectQuery, workflowVariables);
		workflow = workflowResponse.project;
		const dryrunResponse = await requestGraphQLClient<{
			dryRun: DryRun;
		}>(getDryRunPhaseResultsQuery, dryrunVariables);
		// set stepsList as nodes
		$stepsList = dryrunResponse.dryRun.nodes;
		// filter out all nodes which are not of type Pod
		$stepsList = $stepsList.filter((item) => item.type === 'Pod');
		for (const node of dryrunResponse.dryRun.nodes) {
			dryRunPhases[node.displayName] = node.phase;
		}

		const metricsResponse = await getMetricsResponse();

		// selectedProjectName.set;
		const result = await getMetricsUsageUtils(
			showMax,
			cpuData,
			memoryData,
			networkDataCombined,
			logs,
			metricsResponse as unknown as DryRunMetrics[]
		);
		showMax = result.showMax;
		allStepNames = result.allStepNames;
		await getMetricsAnalyticsUtils(
			allStepNames,
			metricsResponse as unknown as DryRunMetrics[],
			pipelineMetricsAnalytics,
			cpuData,
			memoryData,
			networkDataCombined
		);
		const responses = {
			workflow,
			dryrun: dryrunResponse.dryRun,
			metrics: metricsResponse
		};
		return responses;
	};

	const getDataPromise = getData();

	function argoStepsToMermaid(argoWorkflowSteps: ArgoWorkflowStep[][]): void {
		let previousStep = '';
		for (const stepList of argoWorkflowSteps) {
			for (const parallellStep of stepList) {
				const stepName = parallellStep.name;
				mermaidCode.push(
					`  ${stepName}["${truncateString(stepName, 12)}"];`,
					`  click ${stepName} href "javascript:console.log('task ${stepName}');"`,
					`  style ${stepName} fill:${colors[dryRunPhases[stepName] as keyof typeof colors]}`
				);
			}
			if (previousStep === '') {
				const stepName = stepList[0].name;
				previousStep = stepName;
			} else if (stepList.length > 1) {
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
		}
	}

	function argoDAGtoMermaid(argoWorkflowDag: ArgoWorkflowDag): void {
		const operators = new Set(['&&', '||', '!']);
		for (const task of argoWorkflowDag.tasks) {
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
				for (const dep of depends.split(' ')) {
					if (!operators.has(dep)) {
						mermaidCode.push(`  ${dep} --> ${taskName};`);
					}
				}
			}
		}
	}

	function buildDiagram(): void {
		mermaidCode = []; // clear mermaidCode
		mermaidCode.push(`graph ${graphOrientation};`);
		for (const template of workflow.workflowTemplates[0]?.argoWorkflowTemplate.spec.templates ??
			[]) {
			try {
				if (template.dag) argoDAGtoMermaid(template.dag);
				else if (template.steps) argoStepsToMermaid(template.steps);
			} catch (error) {
				// TODO: implement proper error handling
				// eslint-disable-next-line no-console
				console.log(error);
			}
		}
		diagram = mermaidCode.join('\n');
	}

	function stepOnClick(stepName: string /* , stepType: string */): void {
		selectStepName = stepName;
	}

	$: getLogs = (): string[] => {
		if (selectedStep !== 'Total') {
			return [selectedStep];
		}
		return allStepNames;
	};

	$: getResource = (
		resource: string
	): { title: string; data: { x: string[]; y: number[]; type: string; name: string }[] } => {
		let resourceData: {
			[key: string]: { x: string[]; y: number[]; type: string; name: string };
		} = {};
		let resourceDataButNetwork: {
			[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
		} = {};
		let wholeData: { x: string[]; y: number[]; type: string; name: string }[] = [];
		if (resource === 'cpu') {
			resourceData = cpuData;
			if (Object.keys(cpuData).length > 0)
				for (const step of allStepNames) {
					if (cpuData[step]) wholeData.push(cpuData[step]);
				}
		} else if (resource === 'memory') {
			resourceData = memoryData;
			if (Object.keys(memoryData).length > 0)
				for (const step of allStepNames) {
					if (memoryData[step]) wholeData.push(memoryData[step]);
				}
		} else {
			resourceDataButNetwork = networkDataCombined;
			wholeData = [];
			for (const step of allStepNames) {
				if (networkDataCombined[step])
					for (const element of networkDataCombined[step]) {
						wholeData.push(element);
					}
			}
		}
		if (selectedStep !== 'Total') {
			if (resource === 'network')
				return {
					title: `${selectedStep}`,
					data: resourceDataButNetwork[selectedStep] ?? []
				};
			return {
				title: `${selectedStep}`,
				data: resourceData[selectedStep] ? [resourceData[selectedStep]] : []
			};
		}
		return { title: `- entire dry run`, data: wholeData };
	};

	onMount(async () => {
		await getDataPromise;
		buildDiagram();
	});

	function gotoOverview(): void {
		selectedStep = 'Total';
	}

	function getPartLogs(stepName: string, nmaxlinelength: number): string {
		const steplogs = logs[stepName];
		if (steplogs.length < nmaxlinelength) return steplogs;
		return `${steplogs.slice(0, nmaxlinelength)}...`;
	}
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<h1>
				<a href="/projects">Projects</a>
				<span STYLE="font-size:14px">/ </span>
				<a href={`/projects/project_id/${selectedProject?.id}`}>{selectedProject?.name}</a>
				<span STYLE="font-size:14px">/ </span>
				<button on:click={gotoOverview}>{data.resource} </button>
				{#if selectStepName !== 'Total'}
					<span STYLE="font-size:14px">/ </span>{selectStepName}
				{/if}
				<a
					class="btn-icon btn-icon-sm"
					href={`/projects/project_id/${data.resource}/${data.resource}/cpu`}
					><ZoomInIcon />
				</a>
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
								<th>Status</th>
								<th>Output</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<tr on:click={stepOnClick.bind(undefined, step.displayName)}>
									<td style="width:15%">{step.displayName}</td>
									<td style="width:20%">
										{step.startedAt ?? '-'}
									</td>
									<td style="width:20%">
										{step.finishedAt ?? '-'}
									</td>
									<td style="width:15%">{displayStepDuration(step)}</td>
									<td style="width:15%">{step.phase}</td>
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
			<div class="grid grid-rows-4 grid-cols-2 gap-5 h-[80rem]">
				<div class="card logcard row-span-4 p-5">
					<header class="card-header"><h1>Logs</h1></header>
					<section class="p-1">
						<br />
						<ul class="list">
							{#if showLogs}
								{#each getLogs() as key}
									<li>
										<h2>{key}</h2>
									</li>
									<li>
										{#if logs[key] !== undefined}
											<div class="w-full">
												<CodeBlock language="bash" code={getPartLogs(key, 20_000)} />
											</div>
										{:else}
											<p>No logs</p>
										{/if}
									</li>
									<br />
								{/each}
							{:else}
								<p>No data</p>
							{/if}
						</ul>
					</section>
				</div>

				{#if showMax}
					<div class="card p-2">
						<table class="table table-interactive">
							<thead>
								<tr>
									<th>Resource</th>
									<th>Average, Maximum usage</th>
								</tr>
							</thead>
							<tbody>
								{#each Object.keys(pipelineMetricsAnalytics[selectedStep]) as key}
									<tr>
										<td>{key}</td>
										{#if key === 'CPU'}
											<td>
												{pipelineMetricsAnalytics[selectedStep][key].avg.toFixed(3)} %,
												{pipelineMetricsAnalytics[selectedStep][key].max.toFixed(3)}
												%
											</td>
											<!-- for eslint -->
										{:else if key === 'Memory' || key === 'Network_received' || key === 'Network_transferred'}
											<!-- <td
												>{filesize(pipelineMetricsAnalytics[selectedStep][key].avg)},
												{filesize(pipelineMetricsAnalytics[selectedStep][key].max)}</td
											> -->
											<td
												>{pipelineMetricsAnalytics[selectedStep][key].avg},
												{pipelineMetricsAnalytics[selectedStep][key].max}</td
											>
										{:else if key === 'Duration'}
											<td> {pipelineMetricsAnalytics[selectedStep][key]}</td>
										{/if}
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				{:else}
					<div class="placeholder">
						<p>No data</p>
						<ProgressBar />
					</div>
				{/if}

				<div class="flex card p-2">
					<div class="flex container h-full w-full">
						<div class="place-content-center h-full w-full">
							<Plot
								data={getResource('cpu').data}
								plot_title={`CPU Usage ${getResource('cpu').title}`}
								xaxis_title="time"
								yaxis_title="cpu usage"
							/>
						</div>
					</div>
				</div>
				<div class="flex card p-2">
					<div class="flex container h-full w-full">
						<div class="place-content-center h-full w-full">
							<Plot
								data={getResource('memory').data}
								plot_title={`Memory Usage ${getResource('memory').title}`}
								xaxis_title="time"
								yaxis_title="bytes"
							/>
						</div>
					</div>
				</div>

				<div class="flex card p-2">
					<div class="flex container h-full w-full">
						<div class="place-content-center h-full w-full">
							<Plot
								data={getResource('network').data}
								plot_title={`Network ${getResource('network').title}`}
								xaxis_title="time"
								yaxis_title="bytes"
							/>
						</div>
					</div>
				</div>
			</div>
		{/await}
	</div>
</div>

<style>
	.card {
		min-height: 10rem;
		max-height: 30rem;
		min-width: 10rem;
	}
	.logcard {
		overflow-y: scroll;
		max-height: fit-content;
	}
	ul {
		max-height: 50vh;
		max-height: fit-content;
	}
</style>
