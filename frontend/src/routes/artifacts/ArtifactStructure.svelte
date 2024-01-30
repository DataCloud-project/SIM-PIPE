<script lang="ts">
	import Artifact from "./Artifact.svelte";
  import { reactiveArtifacts, type ArtifactHierarchyType } from '$lib/folders_types';
  import type { StructureType, ArtifactType } from '$lib/folders_types';

  export let artifacts: ArtifactType[];
  let currentLevel: { [key: string]: any } = {};

  function buildFolderStructure(artifacts: ArtifactType[]): StructureType {
  const structure: StructureType = { path: '', children: {} };

  artifacts.forEach(entry => {
    let currentLevel = structure;
    const parts = entry.name.split('/');

    parts.forEach(part => {
      if (!currentLevel.children[part]) {
        currentLevel.children[part] = { path: `${currentLevel.path}/${part}`, children: {} };
      }
      currentLevel = currentLevel.children[part];
    });
  });
  return structure;
}

  function renderFolderStructure(structure: StructureType, depth = 0): ArtifactHierarchyType[] {
    const folders: ArtifactHierarchyType[] = [];
    let folder: ArtifactHierarchyType;
    for (let key in structure.children) {
      let subfolders = Object.keys(structure.children[key].children).length > 0 ? renderFolderStructure(structure.children[key], depth + 1) : [];
      folder = {
        name: key, 
        subfolders: subfolders, 
        isExpanded: false,
        isSelected: false,
        path: structure.children[key].path
      };
      folders.push(folder);
    }
    return folders;
  }


  let folders = renderFolderStructure(buildFolderStructure(artifacts));
  $: reactiveArtifacts.set(folders);

</script>

<style>
  .artifact-structure {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    overflow-y: auto;
    overflow-x: scroll;
    width: 100%;
  }
</style>

<div class="flex artifact-structure">
  <div class="grid grid-cols-1 justify-items-start pl-5">
    {#each $reactiveArtifacts as artifact (artifact.name)}
      <Artifact {artifact} />
    {/each}
  </div>
</div>
