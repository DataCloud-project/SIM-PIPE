<script lang="ts">
	import { HelpCircleIcon, PlayCircleIcon, StopCircleIcon, PlusIcon } from 'svelte-feather-icons';

	export let action: string;
</script>

{#if action == 'rerun'}
	<div class="relative">
		<PlusIcon size="13" class="absolute left-5 top-0" />
		<PlayCircleIcon size="20" />
	</div>
{:else if action == 'run'}
	<PlayCircleIcon size="20" />
{:else if action == 'stop'}
	<StopCircleIcon size="20" />
{:else}
	<HelpCircleIcon size="20" />
{/if}
