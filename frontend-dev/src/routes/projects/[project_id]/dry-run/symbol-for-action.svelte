<script lang="ts">
	import { HelpCircleIcon, PlayCircleIcon, StopCircleIcon, PlusIcon } from 'svelte-feather-icons';

	export let action: string;
</script>

{#if action == 'rerun'}
	<div class="relative">
		<div class="absolute left-5 bottom-2 font-bold">+</div>
		<PlayCircleIcon size="20" />
	</div>
{:else if action == 'run'}
	<PlayCircleIcon size="20" />
{:else if action == 'stop'}
	<StopCircleIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
