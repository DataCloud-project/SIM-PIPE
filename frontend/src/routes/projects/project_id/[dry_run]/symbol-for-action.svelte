<script lang="ts">
	import { type ModalSettings, modalStore } from '@skeletonlabs/skeleton';
	import {
		AlertCircleIcon,
		HelpCircleIcon,
		PauseIcon,
		PlayIcon,
		RepeatIcon,
		StopCircleIcon
	} from 'svelte-feather-icons';

	import { requestGraphQLClient } from '$lib/graphql-utils.js';

	import resumeDryRunMutation from '../../../../queries/resume_dry_run.js';
	import stopDryRunMutation from '../../../../queries/stop_dry_run.js';
	import suspendDryRunMutation from '../../../../queries/suspend_dry_run.js';
	import { pausedDryRuns } from '../../../../stores/stores.js';

	export let action: string, dryRunId: string;
	$: paused = $pausedDryRuns?.includes(dryRunId);

	async function displayAlert(title: string, body: string) {
		const alertModal: ModalSettings = {
			type: 'alert',
			title,
			body
		};
		modalStore.trigger(alertModal);
		await new Promise((resolve) => setTimeout(resolve, 1000));
		modalStore.close();
		modalStore.clear();
	}

	async function stopRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(stopDryRunMutation, { dryRunId, terminate: false });
			displayAlert('Stopping dry run..', `ID: ${dryRunId}`);
		} catch (error) {
			// TODO: handle error
			console.log('Error! to be handled');
			console.log(error);
		}
	}
	async function pauseRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(suspendDryRunMutation, { dryRunId, terminate: false });
			paused = true;
			$pausedDryRuns.push(dryRunId);
			displayAlert('Pausing dry run..', `ID: ${dryRunId}`);
		} catch (error) {
			// TODO: handle error
			console.log('Error! to be handled');
			console.log(error);
		}
	}
	async function resumeRun(event: any) {
		try {
			event.stopPropagation();
			await requestGraphQLClient(resumeDryRunMutation, { dryRunId, terminate: false });
			paused = false;
			$pausedDryRuns.filter((item) => item !== dryRunId);
			displayAlert('Resuming dry run..', `ID: ${dryRunId}`);
		} catch (error) {
			// TODO: handle error
			console.log('Error! to be handled');
			console.log(error);
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
