<script lang="ts">
	import { XIcon, CheckIcon, ClockIcon, RefreshCwIcon, HelpCircleIcon } from 'svelte-feather-icons';

	export let run_result: string;
</script>

{#if run_result == 'Succeeded'}
	<CheckIcon size="20" />
{:else if run_result == 'Failed'}
	<XIcon size="20" />
{:else if run_result == 'Pending'}
	<ClockIcon size="20" />
{:else if run_result == 'Running'}
	<RefreshCwIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
