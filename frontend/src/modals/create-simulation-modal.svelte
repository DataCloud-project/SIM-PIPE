<script lang="ts">
  import { getContext } from 'svelte';
  import allSimulationsQuery from '../queries/all-simulations.js';
  import createSimulationMutation from '../queries/create-simulation.js';
  import { graphQLClient, simulationsList } from '../stores/stores.js';
  import Alert from './alert-modal.svelte';
  import type { ModalContext, Simulation } from '../types';

  const { open, close } = getContext<ModalContext>('simple-modal');
  let name = '';
  let files: FileList;

  async function executeCreateSimulation(): Promise<void> {
    const pipelineDescription = await files[0].text();

    // call create simulation
    const variables = {
      name,
      pipeline_description: pipelineDescription,
    };
    const result = await $graphQLClient.request<{
      Create_Simulation: string;
    }>(createSimulationMutation, variables);
    const output = JSON.parse(result.Create_Simulation) as { code: number; message: string };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! ${name} is created` });
      // refresh list of simulations after new simulation is created
      const simulationListResponse = await $graphQLClient.request<{
        All_Simulations: { simulations: Simulation[] };
      }>(allSimulationsQuery);
      $simulationsList = simulationListResponse.All_Simulations.simulations;
    } else {
      const json = JSON.parse(result.Create_Simulation) as { message: string };
      if (json.message) {
        open(Alert, { message: json.message });
      } else {
        open(Alert, { message: 'Unable to create simulation' });
      }
    }
    setTimeout(close, 1500);
  }
</script>

<div class="outer_modal_box">
  <h1>Enter details of simulation</h1>
  <div class="modal_box">
    <p><strong>Name: </strong><input bind:value="{name}" placeholder="Enter name" /></p>

    <!-- <p><strong>Model id:</strong> <input bind:value={model_id} /></p> -->
    <p><strong>Upload pipeline description </strong></p>
    <input type="file" bind:files="{files}" />
    <br /><br />
  </div>

  <br />
  <p>
    <button class="cancel_button" on:click="{close}"> Cancel </button>
    <button class="confirm_button" on:click="{executeCreateSimulation}"> Create simulation </button>
  </p>
  <br /><br />
</div>

<style>
  input,
  p {
    font-size: 18px;
    color: black;
    margin-left: 10px;
  }
  h1 {
    color: black;
  }
</style>
