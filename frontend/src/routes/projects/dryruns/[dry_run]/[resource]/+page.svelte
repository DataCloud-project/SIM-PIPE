<script lang="ts">
	import { onMount } from 'svelte';
	import { ProgressBar, CodeBlock, getModalStore } from '@skeletonlabs/skeleton';
	import { AlertTriangleIcon, ZoomInIcon } from 'svelte-feather-icons';
	import { filesize } from 'filesize';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
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
	import type { DryRunMetrics, DryRun, MetricsWithTimeStamps, Artifact } from '$typesdefinitions';
	import getMooseAnalysisQuery from '$queries/get_moose_analysis.js';
	import setMooseReportMutation from '$queries/set_moose_report.js';

	// Extended type to include carbontracker data
	interface ExtendedDryRunMetrics extends DryRunMetrics {
		carbontracker?: {
			fetchCarbontrackerData?: {
				co2eq: number;
				energy: number;
			};
		};
	}

	type MooseEntity = { text: string; type_id: string; confidence: number };

	let mooseEntities: MooseEntity[] = [];
	let showMooseModal = false;
	let selectedArtifact: Artifact | undefined;
	let mooseJobStatus: string | undefined;
	let latestMooseReportJson: string | undefined;
	let hasUnsavedMooseReport = false;
	const modalStore = getModalStore();

	export let data;

	let loadingFinished = false;
	// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
	let loadingError: unknown | undefined;
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
			loadingError = 'Failed to load metrics';
			console.log('Failed to load metrics', error);
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
		const dryRunId = data.resource;

		// Kick off independent requests as early as possible
		const dryRunPromise = requestGraphQLClient<{
			dryRun?: { project: { name: string; id: string } };
		}>(getDryRunQuery, { dryRunId });
		const metricsPromise = getMetricsResponse();
		const dryrunPhasePromise = requestGraphQLClient<{ dryRun: DryRun }>(
			getDryRunPhaseResultsQuery,
			{ dryRunId }
		);

		const selectedProjectResponse = await dryRunPromise;
		if (!selectedProjectResponse.dryRun?.project) {
			throw new Error('Project not found');
		}
		selectedProject = selectedProjectResponse.dryRun.project;
		selectedProjectName.set(selectedProject.name);
		selectedDryRunName.set(dryRunId);

		const workflowPromise = requestGraphQLClient<any>(getProjectQuery, {
			projectId: selectedProject.id
		});

		const [workflowResponse, dryrunResponse, metricsResponse] = await Promise.all([
			workflowPromise,
			dryrunPhasePromise,
			metricsPromise
		]);

		// set stepsList as nodes
		$stepsList = dryrunResponse.dryRun.nodes;
		// filter out all nodes which are not of type Pod
		$stepsList = $stepsList.filter((item) => item.type === 'Pod');
		dryrunResponse.dryRun.nodes.forEach((node: DryRunMetrics) => {
			dryRunPhases[node.displayName] = node.phase;
		});

		const metrics = (metricsResponse as unknown as DryRunMetrics[]) ?? [];
		if (metrics.length === 0) {
			loadingError = loadingError ?? 'No metrics returned for this dry run';
		}

		const result = await getMetricsUsageUtils(metrics);
		const { allStepNames } = result;
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
		}> = await Promise.all(
			metrics
				.filter((step) => step.type === 'Pod')
				.map(async (step) => ({
					nodeId: step.id,
					stepName: step.displayName,
					carbonData: await getCarbontrackerDataResponse(step.metrics.cpuUsageSecondsTotal)
				}))
		);

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
			metrics,
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
		const templates = workflow.workflowTemplates?.[0]?.argoWorkflowTemplate?.spec?.templates ?? [];
		for (const template of templates) {
			try {
				if (template.dag) argoDAGtoMermaid(template.dag);
				else if (template.steps) argoStepsToMermaid(template.steps);
			} catch (error) {
				console.log('Error building mermaid diagram', error);
				goto(`/projects/dryruns/${selectedProject?.id}`);
				break;
			}
		}
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
		try {
			const getDataResponse = await getData();
			workflow = getDataResponse.workflow;
			allStepNames = getDataResponse.allstepnames;
			await buildDiagram();
			computePipelineDuration();
			loadingFinished = true;
		} catch (error) {
			loadingError = error;
		}
	});

	async function onAnalyze(
		artifact: Artifact,
		stepStartedAt: string | undefined,
		attempt_rerun = false
	): Promise<void> {
		selectedArtifact = artifact;
		let results: { entities?: MooseEntity[] }[] | undefined;

		// Decide whether this call should persist the report server-side.
		// - First run (no existing mooseReport): save by default.
		// - Rerun: preview only (save = false); user can choose to save.
		const shouldSaveOnServer = !attempt_rerun && !artifact.mooseReport;

		if (!artifact.mooseReport || attempt_rerun) {
			const mooseAPIMessageModal: ModalSettings = {
				type: 'alert',
				title: 'Calling Moose API with the artifact text✨',
				body: `Awaiting response from API...`
			};
			modalStore.trigger(mooseAPIMessageModal);

			// eslint-disable-next-line no-promise-executor-return
			await new Promise((resolve) => setTimeout(resolve, 2500));
			modalStore.close();
			const response = await requestGraphQLClient<{ result: string }>(getMooseAnalysisQuery, {
				artifactUrl: artifact.url,
				stepStartedAt: stepStartedAt ?? undefined,
				save: !!shouldSaveOnServer
			});
			console.log('Moose analysis response:', response.result);
			latestMooseReportJson = response.result;
			hasUnsavedMooseReport = !shouldSaveOnServer;
			const job = JSON.parse(response.result) as {
				status?: string;
				error?: string;
				result?: { entities?: MooseEntity[] };
			};
			mooseJobStatus = job.status ?? undefined;
			mooseEntities = job.result?.entities ?? [];

			// Refresh dry run nodes from backend so artifacts include the stored Moose report
			try {
				const dryrunVariables = {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					dryRunId: data.resource
				};
				const dryrunResponse: { dryRun: DryRun } = await requestGraphQLClient(
					getDryRunPhaseResultsQuery,
					dryrunVariables
				);
				// update steps list and phases
				$stepsList = dryrunResponse.dryRun.nodes;
				$stepsList = $stepsList.filter((item) => item.type === 'Pod');
				dryrunResponse.dryRun.nodes.forEach((node: DryRunMetrics) => {
					dryRunPhases[node.displayName] = node.phase;
				});
			} catch (error) {
				// eslint-disable-next-line no-console
				console.error('Error refreshing dry run after Moose analysis', error);
			}
		} else {
			// get job from stored Moose report
			latestMooseReportJson = artifact.mooseReport;
			hasUnsavedMooseReport = false;
			const job = JSON.parse(artifact.mooseReport) as {
				status?: string;
				error?: string;
				result?: { entities?: MooseEntity[] };
			};
			mooseJobStatus = job.status ?? undefined;
			mooseEntities = job.result?.entities ?? [];
		}

		showMooseModal = true;
	}

	async function rerunMooseAnalysis(): Promise<void> {
		if (!selectedArtifact) return;
		showMooseModal = false;
		await onAnalyze(selectedArtifact, undefined, true);
	}

	async function saveMooseReport(): Promise<void> {
		if (!selectedArtifact || !latestMooseReportJson) return;
		try {
			const url = new URL(selectedArtifact.url);
			const pathParts = url.pathname.replace(/^\/+/, '').split('/');
			const bucketName = pathParts.shift()!;
			const objectName = pathParts.join('/');

			await requestGraphQLClient(setMooseReportMutation, {
				bucketName,
				key: objectName,
				report: latestMooseReportJson
			});
			hasUnsavedMooseReport = false;
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Error saving Moose report', error);
		}
	}

	async function downloadSotwCsv(artifact: Artifact | null | undefined): Promise<void> {
		const sotwUrl = artifact?.sotwReportUrl;
		if (sotwUrl) {
			try {
				const response = await fetch(sotwUrl);
				if (!response.ok) throw new Error('Failed to fetch SoTW CSV');
				const blob = await response.blob();
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.href = url;
				// Use artifact name for the download filename, fallback to sotw.csv
				let baseName = artifact?.name || 'sotw';
				// Remove any path from name if present
				baseName = baseName.split('/').pop() || baseName;
				link.download = `${baseName}.sotw.csv`;
				document.body.append(link);
				link.click();
				link.remove();
				URL.revokeObjectURL(url);
			} catch (error) {
				console.error('Error downloading SoTW CSV:', error);
				alert('Failed to download SoTW CSV.');
			}
			return;
		}
		// if there is no sotwReportUrl, show a modal stating that the report is not available
		const noReportModal: ModalSettings = {
			type: 'alert',
			title: 'SoTW report not available⚠️',
			body: `The SoTW report for this artifact is not available.`
		};
		modalStore.trigger(noReportModal);
		await new Promise((resolve) => {
			setTimeout(resolve, 2000);
		});
		modalStore.close();
	}

	function getPartLogs(stepName: string, nmaxlinelength: number): string {
		const steplogs = logs[stepName];
		// console.log('stepName:', stepName);
		// console.log('steplogs:', steplogs);
		// eslint-disable-next-line unicorn/prefer-ternary
		if (steplogs.length < nmaxlinelength) return steplogs;
		// eslint-disable-next-line no-else-return
		else return `${steplogs.slice(0, nmaxlinelength)}...`;
	}

	// Utility to extract a short error message from a possibly large/unknown error value
	function getShortErrorMessage(error: unknown): string {
		if (!error) return '';
		// Most common case
		if (error instanceof Error) return error.message;
		// Some libraries throw plain objects with a message
		if (typeof error === 'object' && 'message' in error) {
			const maybeMessage = (error as { message?: unknown }).message;
			if (typeof maybeMessage === 'string' && maybeMessage.trim() !== '') return maybeMessage;
		}
		// Sometimes it is already a string (or a JSON string)
		if (typeof error === 'string') {
			try {
				const match = error.match(/"message"\s*:\s*"([^"]+)"/);
				if (match?.[1]) return match[1];
				const obj = JSON.parse(error) as { message?: unknown };
				if (typeof obj?.message === 'string' && obj.message.trim() !== '') return obj.message;
			} catch {
				// Not JSON; fall through
			}
			return error.length > 200 ? `${error.slice(0, 200)}...` : error;
		}
		// Last resort
		try {
			return JSON.stringify(error).slice(0, 200);
		} catch {
			return String(error);
		}
	}
</script>

<div class="flex w-full content-center p-10">
	<div class="table-container">
		{#if loadingError}
			<div class="card p-4">
				<h2>Failed to load data</h2>
				<br />
				<p>{getShortErrorMessage(loadingError)}</p>
				<br />
				<button type="button" class="btn btn-sm variant-filled" on:click={() => goto('/projects')}>
					Back to projects
				</button>
			</div>
		{:else if !loadingFinished}
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
			<div class="flex content-center grid grid-flow-rows grid-cols-1 items-center w-full p-3">
				<div>
					<Mermaid {diagram} />
				</div>
				<div>
					<Legend />
				</div>
				<div class="p-3 table-wrapper">
					<table class="table table-interactive p-1">
						<thead>
							<tr>
								<th>Name</th>
								<th>Started</th>
								<th>Finished</th>
								<th>Duration</th>
								<th>CO2 [<span class="lowercase">g</span>]</th>
								<th>Energy [<span class="lowercase">k</span>Wh]</th>
								<th>Status</th>
								<th class="output-col">Output</th>
								<th>Data Analysis</th>
							</tr>
						</thead>
						<tbody>
							{#each reactiveStepsList || [] as step}
								<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
								<tr on:click={() => stepOnClick(step.displayName)}>
									<td>{step.displayName}</td>
									<td>
										{step.startedAt ?? '-'}
									</td>
									<td>
										{step.finishedAt ?? '-'}
									</td>
									<td>{displayStepDuration(step)}</td>
									<td>
										{#if step.carbontracker?.fetchCarbontrackerData?.co2eq}
											{step.carbontracker.fetchCarbontrackerData.co2eq.toFixed(3)}
										{:else}
											-
										{/if}
									</td>
									<td>
										{#if step.carbontracker?.fetchCarbontrackerData?.energy}
											{step.carbontracker.fetchCarbontrackerData.energy.toFixed(6)}
										{:else}
											-
										{/if}
									</td>
									<td>{step.phase}</td>
									<td class="output-col">
										{#if step.outputArtifacts?.length > 1}
											{#each step.outputArtifacts as artifact}
												{#if artifact.name !== 'main-logs'}
													<a href={artifact.url} class="output-link">{artifact.name}</a>
												{/if}
											{/each}
										{:else}
											<p>-</p>
										{/if}
									</td>
									<td>
										{#if step.outputArtifacts?.length > 1}
											<button
												type="button"
												class={`px-3 py-1 rounded border text-xs font-normal cursor-pointer hover:border-slate-400 ${
													step.outputArtifacts?.length > 1 && !step.outputArtifacts[0]?.mooseReport
														? 'bg-amber-100 border-amber-300 text-amber-800 hover:bg-amber-150'
														: 'bg-emerald-100 border-emerald-300 text-emerald-800 hover:bg-emerald-150'
												}`}
												on:click|stopPropagation={() =>
													onAnalyze(step.outputArtifacts[0], step.startedAt)}
											>
												{#if step.outputArtifacts?.length > 1 && !step.outputArtifacts[0]?.mooseReport}
													Run data analysis
												{:else}
													View saved report
												{/if}
											</button>
										{:else}
											-
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				</div>
			</div>
			<div class="grid grid-rows-4 grid-cols-2 gap-5 auto-rows-min p2">
				<!-- if the logs are empty, remove logs sections -->
				{#if Object.values(logs).join('') !== ''}
					<div class="card mainlogcard row-span-4 p-5">
						<!-- display if the dryrun has a non-empty phase message from argo (usually null if no error) -->
						{#if dryRunPhaseMessage}
							<div class="card logcard row-span-1 p-3">
								<div style="display: flex; align-items: center; color: #b45309; gap: 5px">
									<!-- amber-700 -->
									<AlertTriangleIcon />
									<h1>Workflow Failure Summary</h1>
									<br />
								</div>
								<section class="p-1">
									{#if reactiveStepsList && reactiveStepsList.length > 0}
										{#if reactiveStepsList.some((step) => step.phase === 'Failed')}
											<div class="w-full">
												<p style="color: #b45309; font-weight: bold;">
													{reactiveStepsList.filter((step) => step.phase === 'Failed').length} out of
													{reactiveStepsList.length} steps failed.
												</p>
												<p style="color: #b45309;">
													Failed step(s): {reactiveStepsList
														.filter((step) => step.phase === 'Failed')
														.map((s) => s.displayName)
														.join(', ')}
												</p>
											</div>
										{:else}
											<div class="w-full">
												<p style="color: #b45309;">Workflow failed. See logs for details.</p>
											</div>
										{/if}
									{/if}
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
					<table class="table table-interactive w-full p-4">
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

			{#if showMooseModal}
				<div
					class="moose-modal-backdrop w-full"
					on:click={() => {
						showMooseModal = false;
					}}
					role="presentation"
				>
					<div class="moose-modal" on:click|stopPropagation={() => {}} role="presentation">
						<header class="moose-modal-header">
							<h2>Detected privacy-relevant entities</h2>
							<div class="moose-modal-actions">
								<button
									type="button"
									class="moose-btn"
									on:click={async () => {
										await downloadSotwCsv(selectedArtifact ?? undefined);
									}}
								>
									Download SoTW
								</button>
								<button
									type="button"
									class="moose-btn"
									on:click={async () => {
										await rerunMooseAnalysis();
									}}
								>
									Re-run analysis
								</button>
								{#if hasUnsavedMooseReport}
									<button
										type="button"
										class="moose-btn"
										on:click={async () => {
											await saveMooseReport();
										}}
									>
										Save report
									</button>
								{/if}
								<button
									type="button"
									class="moose-btn"
									on:click={() => {
										showMooseModal = false;
									}}
								>
									Close
								</button>
							</div>
						</header>
						<section class="moose-modal-body">
							{#if mooseJobStatus === 'failed'}
								<p class="moose-status moose-status-failed">
									Latest data analysis check run failed; entities may be incomplete.
								</p>
							{/if}
							{#if mooseEntities.length === 0}
								<p>No entities detected in this output.</p>
							{:else}
								<table class="table table-interactive w-full">
									<thead>
										<tr>
											<th>Text</th>
											<th>Type</th>
											<th>Confidence</th>
										</tr>
									</thead>
									<tbody>
										{#each mooseEntities as entity}
											<tr>
												<td>{entity.text}</td>
												<td>{entity.type_id}</td>
												<td>
													{#if entity.confidence > 0.75}
														High
													{:else if entity.confidence < 0.5}
														Low
													{:else}
														Medium
													{/if}
												</td>
											</tr>
										{/each}
									</tbody>
								</table>
							{/if}
						</section>
					</div>
				</div>
			{/if}
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
		overflow: visible;
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
	.moose-modal-backdrop {
		position: fixed;
		inset: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 50;
		border: none;
		padding: 0;
		background-color: rgba(0, 0, 0, 0.5);
	}
	.moose-modal {
		background-color: white;
		border-radius: 0.5rem;
		padding: 1.5rem;
		max-width: 48rem;
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
		box-shadow:
			0 10px 15px -3px rgba(0, 0, 0, 0.1),
			0 4px 6px -2px rgba(0, 0, 0, 0.05);
	}
	.moose-modal-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.moose-modal-actions {
		display: flex;
		gap: 0.5rem;
	}
	.moose-btn {
		padding: 0.25rem 0.75rem;
		border-radius: 0.25rem;
		border: 1px solid #d1d5db;
		background-color: #f9fafb;
		color: #111827;
		font-size: 0.875rem;
		cursor: pointer;
	}
	.moose-btn:hover {
		background-color: #e5e7eb;
	}
	.moose-modal-body {
		max-height: 60vh;
		overflow-y: auto;
	}
	.moose-status {
		margin-bottom: 0.75rem;
		font-size: 0.875rem;
	}
	.moose-status-failed {
		color: #b91c1c;
	}
	ul {
		max-height: 75vh;
		max-height: fit-content;
	}

	.table.table-interactive {
		width: 100%;
		border-collapse: collapse;
		table-layout: fixed;
	}

	/* Prevent long artifact names from bleeding into the next column */
	.output-col {
		max-width: 12rem;
		word-break: break-word;
		white-space: normal;
	}

	.output-link {
		display: inline-block;
		max-width: 100%;
		word-break: break-word;
	}

	/* Improved: Adjust column widths for better layout */
	.table.table-interactive th:nth-child(1),
	.table.table-interactive td:nth-child(1) {
		width: 18%;
		min-width: 14ch;
		max-width: 32ch;
		word-break: break-word;
		white-space: normal;
	}
	.table.table-interactive th:nth-child(2),
	.table.table-interactive td:nth-child(2) {
		width: 10%;
		min-width: 7ch;
		max-width: 14ch;
	}
	.table.table-interactive th:nth-child(3),
	.table.table-interactive td:nth-child(3) {
		width: 10%;
		min-width: 7ch;
		max-width: 14ch;
	}
	.table.table-interactive th:nth-child(4),
	.table.table-interactive td:nth-child(4) {
		width: 8%;
		min-width: 6ch;
		max-width: 10ch;
	}
	.table.table-interactive th:nth-child(5),
	.table.table-interactive td:nth-child(5),
	.table.table-interactive th:nth-child(6),
	.table.table-interactive td:nth-child(6) {
		width: 7%;
		min-width: 5ch;
		max-width: 10ch;
	}
	.table.table-interactive th:nth-child(7),
	.table.table-interactive td:nth-child(7) {
		width: 8%;
		min-width: 6ch;
		max-width: 12ch;
	}
	.table.table-interactive th.output-col,
	.table.table-interactive td.output-col {
		width: 12%;
		min-width: 8ch;
		max-width: 18ch;
	}
	.table.table-interactive th:nth-child(9),
	.table.table-interactive td:nth-child(9) {
		width: 10%;
		min-width: 7ch;
		max-width: 14ch;
	}

	/* Make the small Resource/Metrics table use the full card width with two balanced columns */
	.card.resourcecard .table.table-interactive th:first-child,
	.card.resourcecard .table.table-interactive td:first-child {
		width: 40%;
	}
	.card.resourcecard .table.table-interactive th:last-child,
	.card.resourcecard .table.table-interactive td:last-child {
		width: 60%;
	}
	.card.resourcecard .table.table-interactive thead {
		position: static;
	}

	.table-wrapper {
		width: 100%;
		max-height: 80vh;
		overflow-y: auto;
		overflow-x: auto;
	}

	.table.table-interactive thead {
		position: sticky;
		top: 0;
		background-color: inherit;
		z-index: 1;
	}

	/* Make Moose entities table always span full modal width */
	.moose-modal-body table {
		width: 100%;
		table-layout: fixed;
	}
	.moose-modal-body th:nth-child(1),
	.moose-modal-body td:nth-child(1) {
		width: 33.33%;
	}
	.moose-modal-body th:nth-child(2),
	.moose-modal-body td:nth-child(2),
	.moose-modal-body th:nth-child(3),
	.moose-modal-body td:nth-child(3) {
		width: 33.33%;
	}
</style>
