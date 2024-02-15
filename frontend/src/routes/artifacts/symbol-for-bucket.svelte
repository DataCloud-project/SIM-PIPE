<script lang='ts'>
    import { PocketIcon } from 'svelte-feather-icons';
    import { reactiveBuckets } from '$lib/folders_types';
    import type { BucketHierarchyType } from '$lib/folders_types';
    import { selectedBucket } from '../../stores/stores';


    export let bucket: BucketHierarchyType;

    async function toggleSelected(bucket: BucketHierarchyType) {
        bucket.isSelected = !bucket.isSelected;
        if (bucket.isSelected) {
            $selectedBucket = bucket.bucket;
        }
        $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }
</script>

<style>
    .relative {
        color: yellow;
    }   
</style>

<button on:click={() => toggleSelected(bucket)}>
{#if bucket.isSelected}
    <div class=relative>
        <PocketIcon size="1x"/>
        <div class="absolute left-2 bottom-1 font-bold">v</div>
    </div>
{:else}
    <div>
        <PocketIcon size="1x"/>
    </div>
{/if}
</button>
