<script lang="ts">
	import { XIcon, CheckIcon, ClockIcon, RefreshCwIcon, HelpCircleIcon } from 'svelte-feather-icons';

	export let run_result: string;
</script>

{#if run_result == 'success'}
	<CheckIcon size="20" />
{:else if run_result == 'failed'}
	<XIcon size="20" />
{:else if run_result == 'pending'}
	<ClockIcon size="20" />
{:else if run_result == 'running'}
	<RefreshCwIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
