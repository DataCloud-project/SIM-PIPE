<script lang="ts">
	import { HelpCircleIcon, StopCircleIcon, PauseIcon, PlayIcon, 
		RepeatIcon, 
		AlertCircleIcon} from 'svelte-feather-icons';
	import stopDryRunMutation from '../../../../queries/stop_dry_run.js';
	import suspendDryRunMutation from '../../../../queries/suspend_dry_run.js';
	import resumeDryRunMutation from '../../../../queries/resume_dry_run.js';
	import { pausedDryRuns } from '../../../../stores/stores.js';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { requestGraphQLClient } from '$lib/graphqlUtils.js';

	export let action: string, dryRunId: string;
	$: paused = $pausedDryRuns?.includes(dryRunId);

	async function displayAlert(title:string, body:string){
		const alertModal: ModalSettings = {
				type: 'alert',
				title: title,
				body: body,
			};
			modalStore.trigger(alertModal);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			modalStore.close();
			modalStore.clear();
	}

	async function stopRun() {
		try {
			await requestGraphQLClient(stopDryRunMutation, { dryRunId: dryRunId, terminate: false });
			displayAlert('Stopping dry run..', `ID: ${dryRunId}`);
		} catch (error) {
			// TODO: handle error
			console.log('Error! to be handled')
			console.log(error)
		}
	}
	async function pauseRun() {
		try {
			await requestGraphQLClient(suspendDryRunMutation, { dryRunId: dryRunId, terminate: false });
			paused = true;
			$pausedDryRuns.push(dryRunId);
			displayAlert('Pausing dry run..', `ID: ${dryRunId}`);
		} catch (error){
			// TODO: handle error
			console.log('Error! to be handled')
			console.log(error)
		}
	}
	async function resumeRun() {
		try {
			await requestGraphQLClient(resumeDryRunMutation, { dryRunId: dryRunId, terminate: false });
			paused = false;
			$pausedDryRuns.filter((item)  => item !== dryRunId );
			displayAlert('Resuming dry run..', `ID: ${dryRunId}`);
		} catch (error) {
			// TODO: handle error
			console.log('Error! to be handled')
			console.log(error)
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
		<button  on:click="{pauseRun}"><PauseIcon size="20" /></button>
	{:else}
		<button on:click="{resumeRun}"><PlayIcon size="20" /></button>
	{/if}
	<button on:click="{stopRun}"><StopCircleIcon size="20" /></button>
{:else if action == 'retry'}
	<PlayIcon size="20" />
{:else if action == 'alert'}
	<AlertCircleIcon size="20" />
{:else if action == 'unknown'}
	<AlertCircleIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
