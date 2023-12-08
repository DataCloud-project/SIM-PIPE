<script>
    import { FileIcon } from 'svelte-feather-icons';
    import { onMount } from 'svelte';
    import { getArtifacts } from '$lib/fileserver';
  
    let artifacts = [];

    let selectedFiles = [];

    function toggleFileSelection(file) {
        const index = selectedFiles.indexOf(file);
        if (index < 0) {
            selectedFiles = [...selectedFiles, file];
        } else {
            selectedFiles = selectedFiles.filter(f => f !== file);
        }
    }
  
    onMount(async () => {
      // Fetch file data (you might want to replace this with your server logic)
      const data = await getArtifacts();
      console.log(data);
      artifacts = data.body.files;
    });
  </script>
  
  <style>
      li {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    .selected {
        background-color: yellow;
    }   
  </style>
  
  <main>
    <h1>File Browser</h1>

    <ul>
        {#each artifacts as artifact}
          <li>
            <button 
                on:click={() => toggleFileSelection(artifact)}
                title={artifact.id}
                class:selected={selectedFiles.includes(artifact)}
                >
              <FileIcon size="1x" />
            </button>
            {artifact.name}
          </li>
        {/each}
      </ul>
  </main>