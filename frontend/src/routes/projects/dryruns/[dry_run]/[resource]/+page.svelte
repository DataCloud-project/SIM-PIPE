<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar, CodeBlock } from '@skeletonlabs/skeleton';
	import { ZoomInIcon } from 'svelte-feather-icons';
	import { filesize } from 'filesize';
	import getDryRunMetricsQuery from '$queries/get_dry_run_metrics.js';
	import getProjectQuery from '$queries/get_project';
	import getDryRunPhaseResultsQuery from '$queries/get_dry_run_phase_results';
	import getDryRunQuery from '$queries/get_selected_project';
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
	import { displayAlert } from '$utils/alerts-utils';
	import type { DryRunMetrics, DryRun, MetricsWithTimeStamps } from '$typesdefinitions';

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

	let cpuData: { [key: string]: MetricsWithTimeStamps } = {};
	let memoryData: { [key: string]: MetricsWithTimeStamps } = {};
	let networkDataCombined: {
		[key: string]: MetricsWithTimeStamps[];
	} = {};

	let pipelineMetricsAnalytics: MetricsAnalytics = {};

	let allStepNames: string[] = [];

	$: selectedStep = 'Total';
	$: reactiveStepsList = $stepsList;

	function gotoOverview(): void {
		selectedStep = 'Total';
	}

	let dryRunPhaseMessage: string | null;
	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, consistent-return
	const getMetricsResponse = async () => {
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
			await displayAlert(title, body, 10_000);
		}
	};

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
		cpuData = result.cpuData;
		memoryData = result.memoryData;
		networkDataCombined = result.networkDataCombined;
		logs = result.logs;
		pipelineMetricsAnalytics = await getMetricsAnalyticsUtils(
			allStepNames,
			metricsResponse as unknown as DryRunMetrics[],
			cpuData,
			memoryData,
			networkDataCombined
		);
		const responses = {
			workflow: workflowResponse.project,
			dryrun: dryrunResponse,
			metrics: metricsResponse,
			allstepnames: allStepNames
		};
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
					await displayAlert(title, body, 5000);
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
	}

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	$: getLogs = () => {
		let returnValue = [];
		returnValue = selectedStep === 'Total' ? allStepNames : [selectedStep];
		return returnValue;
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	$: getResource = (resource: string) => {
		let resourceData;
		let wholeData: { x: string[]; y: number[]; type: string; name: string }[] = [];
		if (resource === 'cpu') {
			resourceData = cpuData;
			if (Object.keys(cpuData).length > 0)
				allStepNames.forEach((step) => {
					if (cpuData[step]) wholeData.push(cpuData[step]);
				});
		} else if (resource === 'memory') {
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
		if (selectedStep !== 'Total') {
			if (resource === 'network')
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
		const getDataResponse = await getData();
		workflow = getDataResponse.workflow;
		allStepNames = getDataResponse.allstepnames;
		await buildDiagram();
		loadingFinished = true;
	});

	function getPartLogs(stepName: string, nmaxlinelength: number): string {
		const steplogs = logs[stepName];
		console.log('stepName:', stepName);
		console.log('steplogs:', steplogs);
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
								<th>Status</th>
								<th>Output</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
								<tr on:click={() => stepOnClick(step.displayName)}>
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
					<div class="card logcard row-span-4 p-5">
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
											<div class="w-full">
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
				<!-- display if the dryrun has a non-empty phase message from argo (usually null if no error) -->
				{#if dryRunPhaseMessage}
					<div class="card logcard row-span-4 p-5">
						<h1>Message</h1>
						<section class="p-1">
							<div class="w-full">
								<CodeBlock language="json" code={dryRunPhaseMessage} />
							</div>
						</section>
					</div>
				{/if}

				<div class="card resourcecard">
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
										<td
											>{filesize(pipelineMetricsAnalytics[selectedStep][key].avg)},
											{filesize(pipelineMetricsAnalytics[selectedStep][key].max)}</td
										>
										<!-- <td
											>{pipelineMetricsAnalytics[selectedStep][key].avg},
											{pipelineMetricsAnalytics[selectedStep][key].max}</td
										> -->
									{:else if key === 'Duration'}
										<td> {pipelineMetricsAnalytics[selectedStep][key]}</td>
									{/if}
								</tr>
							{/each}
						</tbody>
					</table>
				</div>

				<div class="card plotcard">
					<Plot
						data={getResource('cpu').data}
						plotTitle={`CPU Usage ${getResource('cpu').title}`}
						xaxisTitle="time"
						yaxisTitle="cpu usage"
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
						data={getResource('network').data}
						plotTitle={`Network ${getResource('network').title}`}
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
	}
	.card.resourcecard {
		overflow-y: scroll;
		overflow-x: scroll;
		min-height: 25rem;
		max-height: fit-content;
	}
	.card.logcard {
		overflow-y: scroll;
		max-height: fit-content;
	}
	ul {
		max-height: 75vh;
		max-height: fit-content;
	}
</style>
