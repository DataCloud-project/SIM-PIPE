<script lang="ts">
	import { PocketIcon } from 'svelte-feather-icons';
	import type { BucketHierarchyType } from '$typesdefinitions';
	import { selectedBucket, reactiveBuckets } from '$stores/stores';

	export let bucket: BucketHierarchyType;

	async function toggleSelected(bucket: BucketHierarchyType): Promise<void> {
		// eslint-disable-next-line no-param-reassign
		bucket.isSelected = !bucket.isSelected;
		if (bucket.isSelected) {
			// set name of currently selected bucket
			$selectedBucket = bucket.bucket;
		}
		// Unset all other buckets
		for (const bucket of $reactiveBuckets) {
			if (bucket.bucket !== $selectedBucket) {
				bucket.isSelected = false;
			}
		}
		// Trigger a re-render
		$reactiveBuckets = [...$reactiveBuckets];
	}
</script>

<button on:click={() => toggleSelected(bucket)}>
	{#if bucket.isSelected}
		<div class="relative">
			<PocketIcon class={`${bucket.isExpanded ? 'rotate45' : 'rotate0'}`} />
			<div class="absolute top-[-10px] right-0 font-bold">v</div>
		</div>
	{:else}
		<div>
			<PocketIcon class={`${bucket.isExpanded ? 'rotate45' : 'rotate0'}`} />
		</div>
	{/if}
</button>

<style>
	.relative {
		color: yellow;
	}
	:global(.rotate0) {
		size: 1x;
	}
	:global(.rotate45) {
		size: 1x;
		transform: rotate(45deg);
	}
</style>
