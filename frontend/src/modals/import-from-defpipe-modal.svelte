<!-- Integration with DEF-PIPE -->
<script lang="ts">
  import { getContext } from 'svelte';
  import createSimulationMutation from '../queries/create-simulation.js';
  import allSimulationsQuery from '../queries/all-simulations.js';
  import { simulationsList, graphQLClient } from '../stores/stores.js';
  import importPipelineFromDefpipeQuery from '../queries/import-pipeline-from-defpipe.js';
  import { SIM_PIPE_CONVERTER_URL } from '../config/config.js';
  import Alert from './alert-modal.svelte';
  import type { ModalContext, Simulation } from '../types';

  export let allCurrentuserPipelines: string[] = [];

  const { open, close } = getContext<ModalContext>('simple-modal');

  let selectedPipeline = '';
  const placeholder = 'Select pipeline';

  async function getPipelineFromDefpipe<PipelineType = unknown>(
    name: string,
  ): Promise<PipelineType> {
    const response = await $graphQLClient.request<{
      ImportPipelineFromDEFPIPE: PipelineType;
    }>(importPipelineFromDefpipeQuery, { name });
    return response.ImportPipelineFromDEFPIPE;
  }

  async function importFromDefpipe(): Promise<unknown> {
    const selectedPipelineDefinition = await getPipelineFromDefpipe(selectedPipeline);
    // convert xtext to internal json format
    const convertedPipeline = await fetch(`${SIM_PIPE_CONVERTER_URL}`, {
      method: 'POST',
      body: JSON.stringify({
        response: selectedPipelineDefinition,
      }),
    });
    const convertedPipelineJson = (await convertedPipeline.json()) as [
      string,
      {
        name: string;
      },
    ];

    // check if conversion was succesful
    if (
      !Array.isArray(convertedPipelineJson) ||
      convertedPipelineJson[0] === 'error' ||
      convertedPipelineJson[1]?.name === undefined
    ) {
      open(Alert, { message: '🎌 Failed! Selected pipeline definition is incomplete' });
      setTimeout(() => {
        close();
      }, 3000);
      return;
    }
    // call create simulation with the converted pipeline description
    const { name } = convertedPipelineJson[1] as { name: string };
    const variables = {
      name,
      pipeline_description: JSON.stringify(convertedPipelineJson[1]),
    };
    const result = await $graphQLClient.request<{
      Create_Simulation: string;
    }>(createSimulationMutation, variables);
    const json = JSON.parse(result.Create_Simulation) as { code: number; message: string };
    const { code, message } = json;
    if (code === 200) {
      open(Alert, { message: `🎐 Success! ${name} is created` });
      // refresh list of simulations after new simulation is created
      // $simulationsList = await $graphQLClient.request(allSimulationsQuery);
      const simulationListResponse = await $graphQLClient.request<{
        All_Simulations: { simulations: Simulation[] };
      }>(allSimulationsQuery);
      $simulationsList = simulationListResponse.All_Simulations.simulations;
    } else {
      open(Alert, { message });
    }
    setTimeout(() => {
      close();
    }, 1000);
  }
</script>

<div class="outer_modal_box">
  <h1>Choose a pipeline to import:</h1>
  <br />
  <select bind:value="{selectedPipeline}">
    <option value="" disabled selected>{placeholder}</option>
    <br />
    {#each allCurrentuserPipelines as value}
      <option value="{value}">
        {value}
      </option>
    {/each}
    <br />
  </select>
  <br /> <br />
  <button class="confirm_button" on:click="{importFromDefpipe}"> Import pipeline </button>
</div>

<style>
  select,
  option {
    color: black;
    font-size: 22px;
  }
  h1 {
    color: black;
  }
</style>
