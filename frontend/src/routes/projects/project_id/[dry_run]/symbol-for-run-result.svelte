<script lang="ts">
	import { CheckIcon, ClockIcon, CoffeeIcon,HelpCircleIcon, XIcon } from 'svelte-feather-icons';

	export let run_result: string;
</script>

{#if run_result == 'Succeeded'}
	<CheckIcon size="20" />
{:else if run_result == 'Failed'}
	<XIcon size="20" />
{:else if run_result == 'Pending'}
	<ClockIcon size="20" />
{:else if run_result == 'Running'}
	<CoffeeIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
