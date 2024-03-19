<script lang='ts'>
    import { FileIcon, FolderIcon } from 'svelte-feather-icons';
    import type { ArtifactHierarchyType } from '$typesdefinitions';
    import { reactiveBuckets, selectedBucket, selectedArtifact } from '$stores/stores';


    export let artifact: ArtifactHierarchyType;
    export let artifactType: string;

    async function toggleSelected(artifact: ArtifactHierarchyType): Promise<void> {
        // eslint-disable-next-line no-param-reassign
        artifact.isSelected = !artifact.isSelected;
        // Set the selected artifact to the selected artifact
        selectedArtifact.set(artifact);
        // Set the selected bucket to the bucket of the selected artifact
        $selectedBucket = artifact.bucket
        // Deselect all other buckets
        for (const bucket of $reactiveBuckets) {
            if (bucket.bucket !== artifact.bucket) {
                bucket.isSelected = false;
            }
        }
        $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }
</script>

<style>
    .relative {
        color: yellow;
    }   
</style>

<button on:click={() => toggleSelected(artifact)}>
{#if artifact.isSelected}
    <div class=relative>
        {#if artifactType === 'file'}
            <FileIcon size="1x"/>
        {:else}
            <FolderIcon size="1x"/>
        {/if}
        <div class="absolute left-2 bottom-1 font-bold">v</div>
    </div>
{:else}
    <div>
        {#if artifactType === 'file'}
            <FileIcon size="1x"/>
        {:else}
            <FolderIcon size="1x"/>
        {/if}
    </div>
{/if}
</button>
