<script lang='ts'>
    import { FileIcon, FolderIcon } from 'svelte-feather-icons';
    import type { ArtifactHierarchyType } from '$lib/folders_types';
    import { reactiveArtifacts } from '$lib/folders_types';


    export let artifact: ArtifactHierarchyType;
    export let artifactType: string;

    async function toggleSelected(artifact: ArtifactHierarchyType) {
        artifact.isSelected = !artifact.isSelected;
        $reactiveArtifacts = [...$reactiveArtifacts]; // Trigger a re-render
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
