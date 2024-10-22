<script lang="ts">
	import {
		HelpCircleIcon,
		StopCircleIcon,
		PauseIcon,
		PlayIcon,
		RepeatIcon,
		AlertCircleIcon
	} from 'svelte-feather-icons';
	// import { getModalStore } from '@skeletonlabs/skeleton';
	import stopDryRunMutation from '$queries/stop_dry_run.js';
	import suspendDryRunMutation from '$queries/suspend_dry_run.js';
	import resumeDryRunMutation from '$queries/resume_dry_run.js';
	import { pausedDryRuns } from '$stores/stores.js';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';
	// import { displayAlert } from '$utils/alerts-utils.js';

	// const modalStore = getModalStore();

	export let action: string;
	export let dryRunId: string;
	$: paused = $pausedDryRuns?.includes(dryRunId);

	async function stopRun(event: any): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			event.stopPropagation();
			// eslint-disable-next-line object-shorthand
			await requestGraphQLClient(stopDryRunMutation, { dryRunId, terminate: false });
			const title = 'Stopping dry run..';
			const body = `ID: ${dryRunId}`;
			// await displayAlert(title, body);
			console.log(title, body);
		} catch (error) {
			const title = 'Error stopping dry run❌!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
		}
	}
	async function pauseRun(event: any): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			event.stopPropagation();
			await requestGraphQLClient(suspendDryRunMutation, { dryRunId, terminate: false });
			paused = true;
			$pausedDryRuns.push(dryRunId);
			const title = 'Pausing dry run..';
			const body = `ID: ${dryRunId}`;
			// await displayAlert(title, body);
			console.log(title, body);
		} catch (error) {
			const title = 'Error pausing dry run❌!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
		}
	}
	async function resumeRun(event: any): Promise<void> {
		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
			event.stopPropagation();
			await requestGraphQLClient(resumeDryRunMutation, { dryRunId, terminate: false });
			paused = false;
			$pausedDryRuns.filter((item) => item !== dryRunId);
			const title = 'Resuming dry run..';
			const body = `ID: ${dryRunId}`;
			// await displayAlert(title, body);
			console.log(title, body);
		} catch (error) {
			const title = 'Error resuming dry run❌!';
			const body = `${(error as Error).message}`;
			// await displayAlert(title, body, 10_000);
			console.log(title, body);
		}
	}
</script>

{#if action === 'rerun'}
	<div class="relative">
		<div class="absolute left-5 bottom-2 font-bold">+</div>
		<RepeatIcon size="20" />
	</div>
{:else if action === 'run'}
	<PlayIcon size="20" />
{:else if action === 'stop'}
	{#if !paused}
		<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
		<button on:click={(event) => pauseRun(event)}><PauseIcon size="20" /></button>
	{:else}
		<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
		<button on:click={(event) => resumeRun(event)}><PlayIcon size="20" /></button>
	{/if}
	<!-- eslint-disable-next-line @typescript-eslint/explicit-function-return-type -->
	<button on:click={(event) => stopRun(event)}><StopCircleIcon size="20" /></button>
{:else if action === 'retry'}
	<PlayIcon size="20" />
{:else if action === 'alert'}
	<AlertCircleIcon size="20" />
{:else if action === 'unknown'}
	<AlertCircleIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
