<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import type { DryRunMetrics, DryRun } from '../../../../../types';
	import getDryRunMetricsQuery from '../../../../../queries/get_dry_run_metrics.js';
	import getDryRunNoLogsMetricsQuery from '../../../../../queries/get_dry_run_metrics_no_logs.js';
	import { format } from 'date-fns';
	import getProjectQuery from '../../../../../queries/get_project';
	import getDryRunPhaseResultsQuery from '../../../../../queries/get_dry_run_phase_results';
	import getDryRunQuery from '../../../../../queries/get_selected_project';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';
	import Plot from './Plot.svelte';
	import Mermaid from './Mermaid.svelte';
	import { colors, maxValuesFormat } from './Config.js';
	import { stepsList } from '../../../../../stores/stores';
	import Legend from './Legend.svelte';

	export let data;
	let workflow: { workflowTemplates: { argoWorkflowTemplate: { spec: { templates: any[] } } }[] };
	let dryrun_results: { dryRun: { nodes: any[] } };
	let selectStepName = '';
	let selectStepType = '';
	let dryRunPhases: { [x: string]: string } = {};
	const graphOrientation = 'LR';

	let mermaidCode = [];
	let diagram: string;
	$: diagram = diagram;
	let selectedProject: { name: any; id: any };
	const datefmt = 'yyyy-MM-dd HH:mm:ss';
	let showLogs = true;
	let logs: { [x: string]: string } = {};

	var cpuData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var memoryData: { [key: string]: { x: string[]; y: number[]; type: string; name: string } } = {};
	var networkDataReceived: {
		[key: string]: { x: string[]; y: number[]; type: string; name: string }[];
	} = {};
	
	const maxValues: { [key: string]: { value: number; unit: string } } = maxValuesFormat;
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
		const selectedProjectResponse = await requestGraphQLClient(getDryRunQuery, {
			dryRunId: data.resource
		});
		selectedProject = selectedProjectResponse.dryRun?.project;
		const workflow_variables = {
			// name: selectedProject?.name
			projectId: selectedProject?.id
		};
		const dryrun_variables = {
			dryRunId: data.resource
		};
		const workflow_response = (await requestGraphQLClient(getProjectQuery, workflow_variables))
			.project;
		const dryrun_response: { dryRun: DryRun } = await requestGraphQLClient(
			getDryRunPhaseResultsQuery,
			dryrun_variables
		);
		// set stepsList as nodes
		$stepsList = dryrun_response.dryRun.nodes;
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
	getDataPromise
		.then((data: { workflow: any; dryrun: any; metrics: any }) => {
			workflow = data.workflow;
			dryrun_results = data.dryrun;
			data.metrics?.forEach(
				(node: {
					log: string;
					displayName: string | number;
					startedAt: string;
					metrics: {
						cpuUsageSecondsTotal: any[];
						memoryUsageBytes: any[];
						networkReceiveBytesTotal: any[];
						networkTransmitBytesTotal: any[];
					};
				}) => {
					// TODO: make more efficient if data missing?
					if (isEmpty(node) === false) {
						if (node.log) {
							logs[node.displayName] = node.log;
						}
						let cpuTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.cpuUsageSecondsTotal.map((item: { timestamp: any }) => item.timestamp)
						);
						let memTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.memoryUsageBytes.map((item: { timestamp: any }) => item.timestamp)
						);
						let nrcTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.networkReceiveBytesTotal.map(
								(item: { timestamp: any }) => item.timestamp
							)
						);
						let ntrTimestamps = timestampsToDatetime(
							node.startedAt,
							node.metrics.networkTransmitBytesTotal.map(
								(item: { timestamp: any }) => item.timestamp
							)
						);
						let cpuValues = node.metrics.cpuUsageSecondsTotal.map((item: { value: string }) =>
							Number(item.value)
						);

						let memValues = node.metrics.memoryUsageBytes.map((item: { value: string }) =>
							Number(item.value)
						);
						let nrcValues = node.metrics.networkReceiveBytesTotal.map((item: { value: string }) =>
							Number(item.value)
						);
						let ntrValues = node.metrics.networkTransmitBytesTotal.map((item: { value: string }) =>
							Number(item.value)
						);
						var cpuUsage = {
							x: cpuTimestamps,
							y: cpuValues,
							type: 'scatter',
							name: node.displayName as string
						};
						var memoryUsage = {
							x: memTimestamps,
							y: memValues,
							type: 'scatter',
							name: node.displayName as string
						};
						var networkReceiveBytesTotal = {
							x: nrcTimestamps,
							y: nrcValues,
							type: 'scatter',
							name: `Received ${node.displayName}`
						};
						var networkTransmitBytesTotal = {
							x: ntrTimestamps,
							y: ntrValues,
							type: 'scatter',
							name: `Transmitted ${node.displayName}`
						};

						if (cpuValues.length > 0) {
							const temp = Math.max(...cpuValues);
							if (temp > maxValues['CPU'].value) {
								maxValues['CPU'].value = temp;
							}
							showMax = true;
							cpuData[node.displayName as string] = cpuUsage;
						}

						if (memValues.length > 0) {
							const temp = Math.max(...memValues);
							if (temp > maxValues['Memory'].value) {
								maxValues['Memory'].value = temp;
							}
							showMax = true;
							memoryData[node.displayName as string] = memoryUsage;
						}

						if (nrcValues.length > 0) {
							const temp = Math.max(...nrcValues);
							if (temp > maxValues['Network received'].value) {
								maxValues['Network received'].value = temp;
							}
							showMax = true;
							if(!networkDataReceived[node.displayName as string])
								networkDataReceived[node.displayName as string] = []
							networkDataReceived[node.displayName as string].push(networkReceiveBytesTotal);
						}
						if (ntrValues.length > 0) {
							const temp = Math.max(...ntrValues);
							if (temp > maxValues['Network transferred'].value) {
								maxValues['Network transferred'].value = temp;
							}
							showMax = true;
							if(!networkDataReceived[node.displayName as string])
								networkDataReceived[node.displayName as string] = []
							networkDataReceived[node.displayName as string].push(networkTransmitBytesTotal);
						}
					}
				}
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

	function addSeconds(date: Date, seconds: number) {
		date.setSeconds(date.getSeconds() + seconds);
		let dateStr = format(date, datefmt);
		return dateStr;
	}

	function timestampsToDatetime(startedAt: string, input_array: number[]) {
		let date = new Date(startedAt);
		let timeseries = [addSeconds(date, 0)];
		for (let i = 0; i < input_array.length - 1; i++) {
			let v = input_array[i + 1] - input_array[i];
			let newDate = addSeconds(date, v);
			timeseries.push(newDate);
		}
		return timeseries;
	}

	function isEmpty(obj: any) {
		return Object.keys(obj).length === 0;
	}

	function argoStepsToMermaid(argoWorkflow: any) {
		let previousStep = '';
		for (const stepList of argoWorkflow) {
			for (const parallellStep of stepList) {
				const stepName = parallellStep.name;
				mermaidCode.push(`  ${stepName}["${stepName}"];`);
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

			mermaidCode.push(`  ${taskName}["${taskName}"];`);
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
		selectStepType = stepType;
	}

	onMount(async () => {
		await getDataPromise;
		buildDiagram();
	});
	$: selectedStep = selectStepName;
	$: selectedStepType = selectStepType;
	$: reactiveStepsList = $stepsList?.slice(1);
	$: reactiveMaxValues = maxValues;
</script>

<div class="container p-5">
	<h1>
		<a href="/projects">Projects</a>
		<span STYLE="font-size:14px">/ </span>
		<button on:click={() => goto(`/projects/[project_id]/${selectedProject?.id}`)}
			>{selectedProject?.name}
		</button>
		<span STYLE="font-size:14px">/ </span>{data.resource}
	</h1>
	<div class="container p-5">
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<div class="grid-cols-2 flex">
				<div class="w-1/2 pt-20 pl-2 pb-2">
					<Mermaid {diagram} />
					<div class="pl-10 pb-2">
						<Legend />
					</div>
				</div>
				<div class=" w-1/2 p-5">
					<table class="table table-interactive">
						<thead>
							<tr>
								<th>Name</th>
								<th>Started</th>
								<th>Finished</th>
								<th>Status</th>
								<th>Output</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<tr on:click={() => stepOnClick(step.displayName, step.type)}>
									<td style="width:15%">{step.displayName}</td>
									<td style="width:35%">
										{step.startedAt ? step.startedAt : '-'}
									</td>
									<td style="width:35%">
										{step.finishedAt ? step.finishedAt : '-'}
									</td>
									<td style="width:15%">{step.phase}</td>
									<td style="width:10%">
										{#if step.type == 'Pod' && step.outputArtifacts?.length > 1}
											{#each step.outputArtifacts as artifact}
												{#if artifact.name != 'main-logs'}
													<a href={step.outputArtifacts[0].url}>{step.outputArtifacts[0].name}* </a>
													<!-- {:else}
													<p>-</p> -->
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
			<br />
			{#if selectedStepType == 'Pod'}
				<div class="grid grid-rows-3 grid-cols-3 gap-8 max-h-screen">
					<div class="card logcard row-span-2 p-5 pr-3">
						<br />
						{#if showLogs}
							<h1>Logs - {selectedStep}</h1>
							<br />
							<ul class="list">
								<div class="pre">
									<code>
										{logs[selectedStep]}
									</code>
								</div>
								<br />
							</ul>
						{:else}
							<p>No data</p>
						{/if}
					</div>
					{#if showMax}
						<div class="card">
							<table class="table table-interactive">
								<thead>
									<tr>
										<th>Resource</th>
										<th>Maximum usage</th>
									</tr>
								</thead>
								<tbody>
									{#each Object.keys(reactiveMaxValues) as key}
										<tr>
											<td>{key}</td>
											{#if maxValues[key].value != -1}
												<td>{maxValues[key].value.toFixed(2)}{maxValues[key].unit}</td>
											{:else}
												<td>-</td>
											{/if}
										</tr>
									{/each}
								</tbody>
							</table>
						</div>
					{/if}

					{#if cpuData[selectedStep]}
						<div class="card">
							<Plot
								data={[cpuData[selectedStep]]}
								plot_title={`CPU Usage ${selectedStep}`}
								xaxis_title="time"
								yaxis_title="cpu usage"
							/>
						</div>
					{:else}
						<p>No CPU Usage data</p>
					{/if}
					{#if memoryData[selectedStep]}
						<div class="card">
							<Plot
								data={[memoryData[selectedStep]]}
								plot_title={`Memory Usage ${selectedStep}`}
								xaxis_title="time"
								yaxis_title="bytes"
							/>
						</div>						
					{:else}
						<p>No Memory Usage data</p>
					{/if}

					{#if networkDataReceived[selectedStep]}
						<div class="card">
							<Plot
								data={networkDataReceived[selectedStep]}
								plot_title={`Network Received ${selectedStep}`}
								xaxis_title="time"
								yaxis_title="bytes"
							/>
						</div>
					{:else}
						<p>No Network Usage data</p>
					{/if}
				</div>
			{/if}
		{/await}
	</div>
</div>

<style>
	.card.logcard {
		overflow-y: scroll;
		/* max-height: fit-content; */
	}
	ul {
		max-height: 50vh;
		/* max-height: fit-content; */
	}
	.pre {
		/* padding: 0 6px; */
		/* border: 1px solid rgb(177, 107, 107); */
		/* box-sizing: border-box; */
		text-align: left;
		overflow-x: hidden;
		overflow-y: scroll;
		/* max-height: 50vh; */
		width: 100%;
		/* max-width: 98%; */
		/* white-space: pre-wrap; */
	}
</style>
