<script lang="ts">
	import { HelpCircleIcon, PlayCircleIcon, StopCircleIcon, PlusIcon } from 'svelte-feather-icons';
	import stopDryRunMutation from '../../../../queries/stop_dry_run.js';
	import { graphQLClient } from '../../../../stores/stores.js';
	import { modalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	export let action: string, dryRunId: string;

	async function stopRun() {
		try {
			await $graphQLClient.request(stopDryRunMutation, { dryRunId: dryRunId, terminate: false });
			const createDryRunErrorModal: ModalSettings = {
				type: 'alert',
				title: 'Stopping dry run..',
				body: `ID: ${dryRunId}`,
			};
			modalStore.trigger(createDryRunErrorModal);
			await new Promise((resolve) => setTimeout(resolve, 1000));
			modalStore.close();
			modalStore.clear();
		} catch {
			// TODO: handle error
			console.log('Error! to be handled')
		}
	}
</script>

{#if action == 'rerun'}
	<div class="relative">
		<div class="absolute left-5 bottom-2 font-bold">+</div>
		<PlayCircleIcon size="20" />
	</div>
{:else if action == 'run'}
	<PlayCircleIcon size="20" />
{:else if action == 'stop'}
	<button  on:click="{stopRun}"><StopCircleIcon size="20" /></button>
{:else}
	<HelpCircleIcon size="20" />
{/if}
