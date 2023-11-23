<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { DryRunMetrics, DryRun } from '../../../../../types';
	import getDryRunMetricsQuery from '../../../../../queries/get_dry_run_metrics.js';
	import getDryRunNoLogsMetricsQuery from '../../../../../queries/get_dry_run_metrics_no_logs.js';
	import getProjectQuery from '../../../../../queries/get_project';
	import getDryRunPhaseResultsQuery from '../../../../../queries/get_dry_run_phase_results';
	import getDryRunQuery from '../../../../../queries/get_selected_project';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';
	import Plot from './Plot.svelte';
	import Mermaid from './Mermaid.svelte';
	import { colors } from './Config.js';
	import { stepsList } from '../../../../../stores/stores';
	import Legend from './Legend.svelte';
	import { ZoomInIcon } from 'svelte-feather-icons';
	import { CodeBlock } from '@skeletonlabs/skeleton';
	import { selectedProjectName, selectedDryRunName } from '../../../../../stores/stores';
	import { filesize } from 'filesize';
	import { time_difference } from '$lib/time_difference.js';
	import {
		getMetricsUsageUtils,
		getMetricsAnalyticsUtils
	} from '../../../../../utils/resource_utils';
	import type { MetricsAnalytics } from '../../../../../utils/resource_utils';

	export let data;
	let workflow: { workflowTemplates: { argoWorkflowTemplate: { spec: { templates: any[] } } }[] };
	let selectStepName = '';
	let dryRunPhases: { [x: string]: string } = {};
	const graphOrientation = 'LR';

	let mermaidCode = [];
	let diagram: string;
	$: diagram = diagram;
	let selectedProject: { name: string; id: string };
	let showLogs = true;
	let logs: { [x: string]: string } = {};

	var cpuData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var memoryData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var networkDataCombined: {
		[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
	} = {};

	let pipelineMetricsAnalytics: MetricsAnalytics = {};

	let showMax = false;
	const getMetricsResponse = async () => {
		const dryrun_variables = {
			dryRunId: data.resource
		};
		try {
			const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
				getDryRunMetricsQuery,
				dryrun_variables
			);
			return metrics_response?.dryRun?.nodes;
		} catch (error) {
			// internal server error from graphql API when requesting logs for dry runs which has no logs
			if ((error as Error).message.includes('No logs found:')) {
				showLogs = false;
				const metrics_response: { dryRun: { nodes: [] } } = await requestGraphQLClient(
					getDryRunNoLogsMetricsQuery,
					dryrun_variables
				);
				return metrics_response?.dryRun?.nodes;
			}
		}
	};

	const getData = async (): Promise<{ workflow: any; dryrun: any; metrics: any }> => {
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
		const workflow_variables = {
			// name: selectedProject?.name
			projectId: selectedProject?.id
		};
		const dryrun_variables = {
			dryRunId: data.resource
		};
		selectedDryRunName.set(data.resource);
		const workflow_response = (await requestGraphQLClient<any>(getProjectQuery, workflow_variables))
			.project;
		const dryrun_response: { dryRun: DryRun } = await requestGraphQLClient(
			getDryRunPhaseResultsQuery,
			dryrun_variables
		);
		// set stepsList as nodes
		$stepsList = dryrun_response.dryRun.nodes;
		// filter out all nodes which are not of type Pod
		$stepsList = $stepsList.filter((entry) => entry.type === 'Pod');
		dryrun_response.dryRun.nodes.forEach((node: DryRunMetrics) => {
			dryRunPhases[node.displayName] = node.phase;
		});

		const metrics_response = await getMetricsResponse();

		const responses = {
			workflow: workflow_response,
			dryrun: dryrun_response,
			metrics: metrics_response
		};
		return responses;
	};

	const getDataPromise = getData();
	function truncateString(word: string, maxLength: number) {
		if (word.length > maxLength) {
			return word.slice(0, maxLength) + '..';
		}
		return word;
	}

	let allStepNames: string[] = [];
	getDataPromise
		.then(async (data: { workflow: any; dryrun: any; metrics: any }) => {
			selectedProjectName.set;
			workflow = data.workflow;
			const result = await getMetricsUsageUtils(
				showMax,
				cpuData,
				memoryData,
				networkDataCombined,
				logs,
				data.metrics
			);
			showMax = result.showMax;
			allStepNames = result.allStepNames;
			await getMetricsAnalyticsUtils(
				allStepNames,
				pipelineMetricsAnalytics,
				cpuData,
				memoryData,
				networkDataCombined
			);
		})
		.catch((error) => {
			console.log(error);
		});

	function generateRandomString() {
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

	function buildDiagram() {
		mermaidCode = []; // clear mermaidCode
		mermaidCode.push(`graph ${graphOrientation};`);
		workflow.workflowTemplates[0]?.argoWorkflowTemplate.spec.templates.forEach((template) => {
			try {
				if (template.dag) argoDAGtoMermaid(template.dag);
				else if (template.steps) argoStepsToMermaid(template.steps);
			} catch (error) {
				console.log(error);
			}
		});
		diagram = mermaidCode.join('\n');
	}

	function argoStepsToMermaid(argoWorkflow: any) {
		let previousStep = '';
		for (const stepList of argoWorkflow) {
			for (const parallellStep of stepList) {
				const stepName = parallellStep.name;
				mermaidCode.push(`  ${stepName}["${truncateString(stepName, 12)}"];`);
				// TODO: replace with actual step click
				mermaidCode.push(`  click ${stepName} href "javascript:console.log('task ${stepName}');"`);
				mermaidCode.push(
					`  style ${stepName} fill:${colors[dryRunPhases[stepName] as keyof typeof colors]}`
				);
			}
			if (previousStep !== '') {
				if (stepList.length > 1) {
					let subgraphName = `parallel-${generateRandomString()}`;
					mermaidCode.push(`  subgraph ${subgraphName}`);
					for (const step of stepList) {
						const stepName = step.name;
						mermaidCode.push(`    ${stepName};`);
					}
					mermaidCode.push(`  end`);
					mermaidCode.push(`  ${previousStep} --> ${subgraphName};`);
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

	function argoDAGtoMermaid(argoWorkflow: { tasks: any[] }) {
		argoWorkflow.tasks.forEach((task) => {
			const taskName = task.name;
			const dependencies = task.dependencies || [];
			const depends = task.depends || '';

			mermaidCode.push(`  ${taskName}["${truncateString(taskName, 12)}"];`);
			// TODO: replace with actual step click
			mermaidCode.push(`  click ${taskName} href "javascript:console.log('task ${taskName}');"`);

			mermaidCode.push(
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

	function stepOnClick(stepName: string, stepType: string) {
		selectStepName = stepName;
	}

	$: getLogs = () => {
		if (selectedStep != '') {
			return [selectedStep];
		}
		return allStepNames;
	};

	$: getResource = (resource: string) => {
		let resourceData;
		let wholeData: { x: string[]; y: number[]; type: string; name: string }[] = [];
		if (resource == 'cpu') {
			resourceData = cpuData;
			if (Object.keys(cpuData).length > 0)
				allStepNames.forEach((step) => {
					if (cpuData[step]) wholeData.push(cpuData[step]);
				});
		} else if (resource == 'memory') {
			resourceData = memoryData;
			if (Object.keys(memoryData).length > 0)
				allStepNames.forEach((step) => {
					if (memoryData[step]) wholeData.push(memoryData[step]);
				});
		} else {
			resourceData = networkDataCombined;
			wholeData = [];
			allStepNames.forEach((step) => {
				networkDataCombined[step]?.forEach((elem) => {
					wholeData.push(elem);
				});
			});
		}
		if (selectedStep != '') {
			if (resource == 'network')
				return {
					title: `${selectedStep}`,
					data: resourceData[selectedStep] ? resourceData[selectedStep] : []
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
	$: selectedStep = selectStepName;
	$: reactiveStepsList = $stepsList;

	function gotoOverview() {
		selectedStep = '';
	}

	function getPartLogs(stepName: string, nmaxlinelength: number) {
		let steplogs = logs[stepName];
		let result = [];
		for (let i = 0; i < steplogs.length; i++) {
			if (steplogs[i].length > nmaxlinelength)
				result.push(steplogs[i].slice(0, nmaxlinelength) + '...');
			else result.push(steplogs[i]);
			result.push();
		}
		return result.join('\n');
	}

	function displayStepDuration(step: DryRunMetrics) {
		if (step.startedAt && step.finishedAt) {
			return time_difference(step.startedAt, step.finishedAt);
		}
		return '-';
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
				<button on:click={() => goto(`/projects/project_id/${selectedProject?.id}`)}
					>{selectedProject?.name}
				</button>
				<span STYLE="font-size:14px">/ </span>
				<button on:click={() => gotoOverview()}>{data.resource} </button>
				{#if selectStepName != ''}
					<span STYLE="font-size:14px">/ </span>{selectStepName}
				{/if}
				<button
					type="button"
					class="btn-icon btn-icon-sm"
					on:click={() => goto(`/projects/project_id/${data.resource}/${data.resource}/cpu`)}
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
								<th>Status</th>
								<th>Output</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<tr on:click={() => stepOnClick(step.displayName, step.type)}>
									<td style="width:15%">{step.displayName}</td>
									<td style="width:20%">
										{step.startedAt ? step.startedAt : '-'}
									</td>
									<td style="width:20%">
										{step.finishedAt ? step.finishedAt : '-'}
									</td>
									<td style="width:15%">{displayStepDuration(step)}</td>
									<td style="width:15%">{step.phase}</td>
									<td style="width:15%">
										{#if step.outputArtifacts?.length > 1}
											{#each step.outputArtifacts as artifact}
												{#if artifact.name != 'main-logs'}
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
										{#if logs[key] != null}
											<div class="w-full">
												<CodeBlock language="bash" code={getPartLogs(key, 20000)} />
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
										{#if key == 'CPU'}
											<td
												>{(
													pipelineMetricsAnalytics[selectedStep][key].avg / allStepNames.length
												).toFixed(3)} %, {pipelineMetricsAnalytics[selectedStep][key].max.toFixed(3)}
												%</td
											>
										<!-- for eslint -->
										{:else if key == 'Memory' || key == 'Network_received' || key == 'Network_transferred'}
											<td
												>{filesize(
													pipelineMetricsAnalytics[selectedStep][key][1] / allStepNames.length
												)}, {filesize(pipelineMetricsAnalytics[selectedStep][key][0])}</td
											>
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
