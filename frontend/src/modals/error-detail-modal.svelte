<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import type { SvelteComponent } from 'svelte';

	import { cBase, cHeader } from '$styles/styles.js';

	// eslint-disable-next-line svelte/valid-compile
	export let parent: SvelteComponent;

	const modalStore = getModalStore();

	$: title = ($modalStore[0]?.meta?.title as string | undefined) ?? 'Error';
	$: message = ($modalStore[0]?.meta?.message as string | undefined) ?? '';

	function onClose(): void {
		modalStore.close();
	}
</script>

{#if $modalStore[0]}
	<div class="{cBase} flex flex-col" style="width: min(90vw, 700px); max-height: 85vh;">
		<header class={cHeader}>{title}</header>
		<pre
			class="flex-1 overflow-y-auto rounded-container-token bg-surface-700 p-3 text-xs leading-relaxed whitespace-pre-wrap break-words"
			style="min-height: 0;">{message}</pre>
		<footer class="flex justify-end pt-2">
			<button class="btn variant-filled" on:click={onClose}>Close</button>
		</footer>
	</div>
{/if}
