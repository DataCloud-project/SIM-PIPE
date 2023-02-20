<script lang="ts">
  import { getContext } from 'svelte';
  import CreateSimulationModal from '../modals/create-simulation-modal.svelte';
  import ImportFromDefpipeModal from '../modals/import-from-defpipe-modal.svelte';
  import { graphQLClient } from '../stores/stores.js';
  import pipelineListFromDefpipeQuery from '../queries/view-pipelines-from-defpipe.js';
  import type { ModalContext } from 'src/types';

  const { open } = getContext<ModalContext>('simple-modal');
  function openCreateSimulationModal(): void {
    open(CreateSimulationModal);
  }
  async function openImportDefPipeModal(): Promise<void> {
    const response = await $graphQLClient.request<{ ViewPipelinesFromDEFPIPE: { name: string }[] }>(
      pipelineListFromDefpipeQuery,
    );
    const allCurrentUserPipelines = response.ViewPipelinesFromDEFPIPE.map(
      (item: { name: string }) => item.name,
    );
    open(ImportFromDefpipeModal, { allCurrentuserPipelines: allCurrentUserPipelines });
  }
</script>

<button class="action_button" on:click="{openCreateSimulationModal}"
  >Import simulation manually</button
>
<br />
<button class="action_button" on:click="{openImportDefPipeModal}">Import from DEF-PIPE</button>
