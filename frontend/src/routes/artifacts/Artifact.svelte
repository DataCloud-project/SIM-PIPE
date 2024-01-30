<script lang="ts">
    import Artifact from './Artifact.svelte';
    import type { ArtifactHierarchyType } from '$lib/folders_types';
    import { reactiveArtifacts } from '$lib/folders_types';
    import SymbolForArtifact from './symbol-for-artifact.svelte';

    export let artifact: ArtifactHierarchyType;

    function toggleOpen(artifact: ArtifactHierarchyType) {
        artifact.isExpanded = !artifact.isExpanded;
        $reactiveArtifacts = [...$reactiveArtifacts]; // Trigger a re-render
    }

    function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    function getArtifactHierarchyType(artifact: ArtifactHierarchyType) {
        if (artifact.name.includes('.')) {
            return 'file';
        } else {
            return 'folder';
        }
    }

</script>

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
