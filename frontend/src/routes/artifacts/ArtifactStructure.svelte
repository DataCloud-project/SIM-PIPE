<script lang="ts">
	import Artifact from "./Artifact.svelte";
  import SymbolForBucket from "./symbol-for-bucket.svelte";
  import { reactiveArtifacts } from '$lib/folders_types';
  import { reactiveBuckets } from '$lib/folders_types';
  import type { StructureType, ArtifactType, ArtifactHierarchyType, Bucket, BucketHierarchyType } from '$lib/folders_types';

  export let buckets: Bucket[];
  //export let bucket: string;
  //export let artifacts: ArtifactType[];
  //let currentLevel: { [key: string]: any } = {};

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
        id: key + '-' + Math.floor(Math.random() * 10 ** 10).toString(),
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

  function toggleOpenBucket(bucket: BucketHierarchyType) {
        bucket.isExpanded = !bucket.isExpanded;
        //$reactiveArtifacts = [...$reactiveArtifacts]; // Trigger a re-render
        $reactiveBuckets = [...$reactiveBuckets]; // Trigger a re-render
    }

  for (let bucket of buckets) {
    console.log(bucket.bucket.name);
    let artifacts = bucket.artifacts;
    let structure = buildFolderStructure(artifacts);
    let folders = renderFolderStructure(structure);
    //$reactiveArtifacts = [...$reactiveArtifacts, ...folders];
    let new_bucket = { bucket: bucket.bucket.name, isExpanded: false, isSelected: false, artifacts: folders };
    $reactiveBuckets = [...$reactiveBuckets, new_bucket];
  }
  //let folders;
  //$: folders = renderFolderStructure(buildFolderStructure(artifacts));
  //$: reactiveArtifacts = folders;

  //$reactiveArtifacts = [...$reactiveArtifacts, ...folders];
  //$: console.log(artifacts);

  $: console.log($reactiveBuckets);

</script>

<div class="flex artifact-structure">
  <div class="grid grid-cols-1 justify-items-start pl-5">
    {#each $reactiveBuckets as bucket (bucket.bucket)}
      <div class="justify-self-start">
        <div>
            <button
                on:dblclick={() => toggleOpenBucket(bucket)}>
                <SymbolForBucket bucket={bucket} />
                <span class="bucket-name">{bucket.bucket}</span>
            </button>
        </div>
      </div>
      {#if bucket.isExpanded}
        {#each bucket.artifacts as artifact (artifact.id)}
          <Artifact {artifact} />
        {/each}
      {/if}
    {/each}
  </div>
</div>

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
  .bucket-name {
      margin-left: 2px;
      font-size: 20px;
  }
</style>


<!-- 
<div class="flex artifact-structure">
  <div class="grid grid-cols-1 justify-items-start pl-5">
    {#each $reactiveArtifacts as artifact (artifact.id)}
      <Artifact {artifact} />
    {/each}
  </div>
</div>
 -->

