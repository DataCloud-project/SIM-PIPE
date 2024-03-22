<script lang="ts">
	import {
		HelpCircleIcon,
		StopCircleIcon,
		PauseIcon,
		PlayIcon,
		RepeatIcon,
		AlertCircleIcon
	} from 'svelte-feather-icons';
	import stopDryRunMutation from '../../../../queries/stop_dry_run.js';
	import suspendDryRunMutation from '../../../../queries/suspend_dry_run.js';
	import resumeDryRunMutation from '../../../../queries/resume_dry_run.js';
	import { pausedDryRuns } from '../../../../stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	import { displayAlert } from '../../../../utils/alerts_utils.js';
	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	export let action: string, dryRunId: string;
	$: paused = $pausedDryRuns?.includes(dryRunId);

	async function stopRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(stopDryRunMutation, { dryRunId: dryRunId, terminate: false });
			const title = 'Stopping dry run..';
			const body = `ID: ${dryRunId}`;
			await displayAlert(title, body);
		} catch (error) {
			const title = 'Error stopping dry run❌!';
			const body = `${(error as Error).message}`;
			await displayAlert(title, body, 10000);
		}
	}
	async function pauseRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(suspendDryRunMutation, { dryRunId: dryRunId, terminate: false });
			paused = true;
			$pausedDryRuns.push(dryRunId);
			const title = 'Pausing dry run..';
			const body = `ID: ${dryRunId}`;
			await displayAlert(title, body);
		} catch (error) {
			const title = 'Error pausing dry run❌!';
			const body = `${(error as Error).message}`;
			await displayAlert(title, body, 10000);
		}
	}
	async function resumeRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(resumeDryRunMutation, { dryRunId: dryRunId, terminate: false });
			paused = false;
			$pausedDryRuns.filter((item) => item !== dryRunId);
			const title = 'Resuming dry run..';
			const body = `ID: ${dryRunId}`;
			await displayAlert(title, body);
		} catch (error) {
			const title = 'Error resuming dry run❌!';
			const body = `${(error as Error).message}`;
			await displayAlert(title, body, 10000);
		}
	}
</script>

{#if action == 'rerun'}
	<div class="relative">
		<div class="absolute left-5 bottom-2 font-bold">+</div>
		<RepeatIcon size="20" />
	</div>
{:else if action == 'run'}
	<PlayIcon size="20" />
{:else if action == 'stop'}
	{#if !paused}
		<button on:click={(event) => pauseRun(event)}><PauseIcon size="20" /></button>
	{:else}
		<button on:click={(event) => resumeRun(event)}><PlayIcon size="20" /></button>
	{/if}
	<button on:click={(event) => stopRun(event)}><StopCircleIcon size="20" /></button>
{:else if action == 'retry'}
	<PlayIcon size="20" />
{:else if action == 'alert'}
	<AlertCircleIcon size="20" />
{:else if action == 'unknown'}
	<AlertCircleIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
