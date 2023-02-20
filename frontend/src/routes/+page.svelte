<script lang="ts">
  import Modal from 'svelte-simple-modal';
  import CreateSimulationButton from '../components/create-simulation-button.svelte';
  import all_simulations_query from '../queries/all-simulations.js';
  import { graphQLClient, simulationsList } from '../stores/stores.js';
  import initKeycloak from '../utils/keycloak.js';
  import type { Simulation } from 'src/types';

  const loading = async (): Promise<Simulation[]> => {
    await initKeycloak();
    const response = await $graphQLClient.request<{
      All_Simulations: {
        simulations: Simulation[];
      };
    }>(all_simulations_query);
    return response.All_Simulations.simulations;
  };
  const simulationsPromise = loading();
  // TODO: All this logic should be moved out of the pages and components.
  simulationsPromise
    .then((value) => {
      $simulationsList = value;
    })
    .catch(() => {
      $simulationsList = undefined;
    });
</script>

<div class="table_container">
  <br /><br />
  <ul class="max_width">
    <li class="table-header-simulations">Simulations</li>
    <br />
    {#await simulationsPromise}
      <p style="font-size:20px;">Loading simulations...</p>
    {:then simulations}
      {#each simulations as simulation}
        <li class="pointer row">
          <a href="{`/${simulation.simulation_id}`}">
            {simulation.name}
          </a>
        </li>
      {/each}
    {:catch}
      <p style="font-size:20px;">🎌 Error! could not load simulations</p>
    {/await}
  </ul>
  <br />
  <div class="create_sim_box">
    <p><Modal><CreateSimulationButton /></Modal></p>
    <br />
  </div>
</div>

<style>
  .create_sim_box {
    margin-left: 40px;
  }
  .max_width {
    max-width: 25%;
  }
  .row {
    background-color: #ffffff;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
  }

  a {
    color: black;
    font-size: 22px;
  }
</style>
