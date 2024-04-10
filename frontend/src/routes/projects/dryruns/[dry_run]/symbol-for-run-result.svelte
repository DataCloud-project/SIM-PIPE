<script lang="ts">
	import { XIcon, CheckIcon, ClockIcon, HelpCircleIcon, CoffeeIcon } from 'svelte-feather-icons';

	export let runResult: string;
</script>

{#if runResult === 'Succeeded'}
	<CheckIcon size="20" />
{:else if runResult === 'Failed'}
	<XIcon size="20" />
{:else if runResult === 'Error'}
	<XIcon size="20" />
{:else if runResult === 'Pending'}
	<ClockIcon size="20" />
{:else if runResult === 'Running'}
	<CoffeeIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
