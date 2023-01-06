<script lang="ts">
  import { getContext } from 'svelte';
  import Alert from '../modals/alert-modal.svelte';
  import deleteRunMutation from '../queries/delete-run.js';
  import deleteSimulationMutation from '../queries/delete-simulation.js';
  import getSimulationQuery from '../queries/get-simulation.js';
  import {
    clickedRun,
    clickedSimulation,
    graphQLClient,
    showStepsList,
    showUsages,
  } from '../stores/stores.js';
  import type { ModalContext, Simulation } from 'src/types';
  // eslint-disable-next-line import/extensions
  import { goto } from '$app/navigation';

  const { open, close } = getContext<ModalContext>('simple-modal');

  export let flag: string;
  async function executeDeleteRun(): Promise<void> {
    if (!$clickedRun) {
      throw new Error('No run selected');
    }

    const result = await $graphQLClient.request<{
      Delete_Run: string;
    }>(deleteRunMutation, { run_id: $clickedRun.run_id });
    const output = JSON.parse(result.Delete_Run) as { code: number; message: string };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! ${$clickedRun.name} has been deleted` });
      setTimeout(() => {
        close();
      }, 1000);
      // refresh run list after run is deleted
      if ($clickedSimulation) {
        const variables = { simulation_id: $clickedSimulation.simulation_id };
        const getSimulationResult = await $graphQLClient.request<{
          Get_Simulation: {
            simulations: Simulation[];
          };
        }>(getSimulationQuery, variables);
        $clickedSimulation = getSimulationResult.Get_Simulation.simulations[0];
        $showStepsList = false; // reset displayed steps
        $showUsages = false; // reset displayed logs and reports
      }
    } else {
      open(Alert, { message: output.message });
      // TODO: concurrencies issues ?
      setTimeout(() => {
        close();
      }, 1000);
    }
  }
  async function executeDeleteSimulation(): Promise<void> {
    if (!$clickedSimulation) {
      throw new Error('No simulation selected');
    }
    const result = await $graphQLClient.request<{
      Delete_Simulation: string;
    }>(deleteSimulationMutation, {
      simulation_id: $clickedSimulation.simulation_id,
    });
    const output = JSON.parse(result.Delete_Simulation) as { code: number; message: string };
    if (output.code >= 200 && output.code < 300) {
      open(Alert, { message: `🎐 Success! ${$clickedSimulation.name} has been deleted` });
      // await 1s
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      close();
      await goto('/');
      // go to all simulations page
    } else {
      open(Alert, { message: output.message });
      setTimeout(() => {
        close();
      }, 1000);
    }
  }

  async function handleClick(): Promise<void> {
    await (flag === 'run' ? executeDeleteRun() : executeDeleteSimulation());
  }
</script>

<h3 class="black">Are you sure ?</h3>

<button class="action_button" on:click="{handleClick}">Yes</button>
<button class="action_button" on:click="{close}">No</button>

<style>
  button {
    margin-left: 40px;
  }
</style>
