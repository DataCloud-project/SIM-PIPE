<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { modeCurrent, ProgressBar } from '@skeletonlabs/skeleton';
	import type { DryRunMetrics, DryRun } from '../../../../../types';
	import getDryRunMetricsQuery from '../../../../../queries/get_dry_run_metrics.js';
	import getDryRunNoLogsMetricsQuery from '../../../../../queries/get_dry_run_metrics_no_logs.js';
	import { format } from 'date-fns';
	import getWorkflowQuery from '../../../../../queries/get_workflow_template';
	import getDryRunPhaseResultsQuery from '../../../../../queries/get_dry_run_phase_results';
	import getDryRunQuery from '../../../../../queries/get_selected_project';
	import { requestGraphQLClient } from '$lib/graphqlUtils';
	import { goto } from '$app/navigation';
	import Plot from './Plot.svelte';
	import Mermaid from './Mermaid.svelte';
	import { colors } from './Config.js'

	export let data;
	let workflow: { workflowTemplate: { argoWorkflowTemplate: { spec: { templates: any[] } } } };
	let dryrun_results: { dryRun: { nodes: any[] } };
	let dryRunPhases: { [x: string]: string } = {};
	const graphOrientation = 'LR';

	let mermaidCode = [];
	let diagram: string;
	$: diagram = diagram;
	let selectedProject: { name: any; id: any };
	const datefmt = 'yyyy-MM-dd HH:mm:ss';
	let showLogs = true;
	let logs: { [x: string]: string } = {};

	var cpuData: { x: string[]; y: number[]; type: string; name: string }[] = [];
	var memoryData: { x: string[]; y: number[]; type: string; name: string }[] = [];
	var networkData: { x: string[]; y: number[]; type: string; name: string }[] = [];

	const getMetricsResponse = async() => {
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
	}

	const getData = async (): Promise<{ workflow: any; dryrun: any; metrics: any }> => {
		const selectedProjectResponse = await requestGraphQLClient(getDryRunQuery, {
			dryRunId: data.resource
		});
		selectedProject = selectedProjectResponse.dryRun?.project;
		const workflow_variables = {
			name: selectedProject?.name
		};
		const dryrun_variables = {
			dryRunId: data.resource
		};
		const workflow_response = await requestGraphQLClient(getWorkflowQuery, workflow_variables);
		const dryrun_response: { dryRun: DryRun } = await requestGraphQLClient(
			getDryRunPhaseResultsQuery,
			dryrun_variables
		);
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
		.then((data: { workflow: any; dryrun: any , metrics: any}) => {
			workflow = data.workflow;
			dryrun_results = data.dryrun;
			data.metrics?.forEach((node) => {
				// TODO: make more efficient if data missing?
				if (isEmpty(node) === false) {
					if (node.log) logs[node.startedAt] = node.log[0];
					let cpuTimestamps = timestampsToDatetime(
						node.startedAt,
						node.metrics.cpuUsageSecondsTotal.map((item) => item.timestamp)
					);
					let memTimestamps = timestampsToDatetime(
						node.startedAt,
						node.metrics.memoryUsageBytes.map((item) => item.timestamp)
					);
					let nrcTimestamps = timestampsToDatetime(
						node.startedAt,
						node.metrics.networkReceiveBytesTotal.map((item) => item.timestamp)
					);
					let ntrTimestamps = timestampsToDatetime(
						node.startedAt,
						node.metrics.networkTransmitBytesTotal.map((item) => item.timestamp)
					);
					let cpuValues = node.metrics.cpuUsageSecondsTotal.map((item) => Number(item.value));
					let memValues = node.metrics.memoryUsageBytes.map((item) => Number(item.value));
					let nrcValues = node.metrics.networkReceiveBytesTotal.map((item) => Number(item.value));
					let ntrValues = node.metrics.networkTransmitBytesTotal.map((item) => Number(item.value));
					var cpuUsage = {
						x: cpuTimestamps,
						y: cpuValues,
						type: 'scatter',
						name: node.displayName
					};
					var memoryUsage = {
						x: memTimestamps,
						y: memValues,
						type: 'scatter',
						name: node.displayName
					};
					var networkReceiveBytesTotal = {
						x: nrcTimestamps,
						y: nrcValues,
						type: 'scatter',
						name: `receive ${node.displayName}`
					};
					var networkTransmitBytesTotal = {
						x: ntrTimestamps,
						y: ntrValues,
						type: 'scatter',
						name: `transmit ${node.displayName}`
					};							

					if (cpuValues.length > 0) {
						cpuData.push(cpuUsage);
					} else {
						// console.log('no cpu data:')
						// console.log(cpuUsage)
					}

					if (memValues.length > 0) {
						memoryData.push(memoryUsage);
					} else {
						// console.log('no memory data:')
						// console.log(cpuUsage)
					}

					if (nrcValues.length > 0) {
						networkData.push(networkReceiveBytesTotal);
					} else {
						// console.log('no network receive data:')
						// console.log(networkReceiveBytesTotal)
					}

					if (ntrValues.length > 0) {
						networkData.push(networkTransmitBytesTotal);
					} else {
						// console.log('no network transmit data:')
						// console.log(networkReceiveBytesTotal)
					}
				}
			});

		})
		.catch((error) => {
			console.log(error);
		});


	export function buildDiagram() {
		mermaidCode = []; // clear mermaidCode
		mermaidCode.push(`graph ${graphOrientation};`);
		workflow.workflowTemplate.argoWorkflowTemplate.spec.templates.forEach((template) => {
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
					let subraphName = 'nested';
					mermaidCode.push(`  subgraph ${subraphName}`);
					for (const step of stepList) {
						const stepName = step.name;
						mermaidCode.push(`    ${stepName};`);
					}
					mermaidCode.push(`  end`);
					mermaidCode.push(`  ${previousStep} --> ${subraphName};`);
					previousStep = subraphName;
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

	onMount(async () => {
		await getDataPromise;
		buildDiagram();
	});

	afterUpdate(async () => {
		await getDataPromise;
		buildDiagram();
	});

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
	<div class="table-container p-5">
		{#await getDataPromise}
			<p>Loading metrics...</p>
			<ProgressBar />
		{:then}
			<div class="grid grid-rows-3 grid-cols-2 gap-4">
				<div class="card">
					<Mermaid diagram={diagram} />
				</div>
				<div class="card">
					<Plot
						data={cpuData}
						plot_title="CPU Usage"
						xaxis_title="time"
						yaxis_title="cpu usage"
					/>
				</div>				
				<div class="card row-span-2">
					<div class="overflow-y-auto card p-5 basis-1/3">
						<div>
							<h1>Logs</h1>
							<br />
							{#if showLogs}
								{#each Object.keys(logs).sort() as key}
									<div class="overflow-y-auto max-h-20">
										<pre class="bg-surface-50-900-token ml-6 mr-6 p-3">{logs[key]}</pre>
									</div>
									<br />
								{/each}
							{:else}
								<p>No data</p>
							{/if}
						</div>
					</div>
				</div>		
				<div class="card">
					<Plot
						data={memoryData}
						plot_title="Memory Usage"
						xaxis_title="time"
						yaxis_title="bytes"
					/>
				</div>
				<div class="card">
					<Plot
					data={networkData}
					plot_title="Network Usage"
					xaxis_title="time"
					yaxis_title="bytes"
				/>
				</div>
			</div>
		{/await}
	</div>
</div>
