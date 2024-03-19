<script lang="ts">
    import { reactiveBuckets } from '$stores/stores';
    import type { ArtifactHierarchyType } from '$typesdefinitions';

    import Artifact from './artifact.svelte';
    import SymbolForArtifact from './symbol-for-artifact.svelte';

    export let artifact: ArtifactHierarchyType;

    function toggleOpen(artifact: ArtifactHierarchyType): void {
        // eslint-disable-next-line no-param-reassign
        artifact.isExpanded = !artifact.isExpanded;
        $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }

    function getArtifactHierarchyType(artifact: ArtifactHierarchyType): string {
        return artifact.name.includes('.') ? 'file' : 'folder';
    }
</script>

<li>
    <div class="justify-self-start">
        <div>
            <button
                on:dblclick={() => toggleOpen(artifact)}>
                <SymbolForArtifact artifact={artifact} artifactType={getArtifactHierarchyType(artifact)} />
                <span style="margin-left: 5px;">{artifact.name}</span>
            </button>
        </div>
    </div>
    {#if artifact.isExpanded && artifact.subfolders.length > 0}
        <ul>
        {#each artifact.subfolders as subfolder (subfolder.name)}
            <Artifact artifact={subfolder} />
        {/each}
        </ul>
    {/if}
</li>

<style>
    ul {
      list-style-type: none;
      padding-left: 20px;
      gap: 2px;
    }
    li {
      display: flex;
      flex-direction: column;
      gap: 2px;
      margin-left: 10px; /* Indentation */
    }
    button {
        display: flex;
        align-items: center;
    }
  </style>