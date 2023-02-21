<script lang="ts">
  import { getContext } from 'svelte';
  import Alert from '../modals/alert-modal.svelte';
  import getSimulationQuery from '../queries/get-simulation.js';
  import { clickedRun, clickedSimulation, graphQLClient, stepsList } from '../stores/stores.js';
  import type { ModalContext, Simulation } from '../types';
  // eslint-disable-next-line import/extensions
  import { goto } from '$app/navigation';

  const { open, close } = getContext<ModalContext>('simple-modal');

  async function executeRefresh(): Promise<void> {
    if (!$clickedSimulation) {
      throw new Error('No simulation selected');
    }
    open(Alert, { message: '🎐 Refreshing' });
    setTimeout(() => {
      close();
    }, 400);
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { simulation_id } = $clickedSimulation;
    try {
      const result = await $graphQLClient.request<{
        Get_Simulation: {
          simulations: Simulation[];
        };
      }>(getSimulationQuery, { simulation_id });
      $clickedSimulation = result.Get_Simulation.simulations[0];
      if ($clickedRun !== undefined) {
        $stepsList = $clickedRun.steps ?? [];
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      // ???
      // eslint-disable-next-line no-console
      console.log('Error in execute_refresh');
      // eslint-disable-next-line no-console
      console.log('JWT token expired while executing refresh, redirecting to login page');
      open(Alert, { message: '⛓ You have been signed out' });

      setTimeout(() => {
        close();
        goto('/').catch((error_) => {
          // eslint-disable-next-line no-console
          console.error(error_);
        });
      }, 500);
    }
  }
</script>

<div style="padding:5px;">
  <button class="action_button back_button">
    <a href="/">Back</a>
  </button>
  {#if $clickedSimulation}
    <button title="Refresh" class="action_button back_button" on:click="{executeRefresh}">
      <a href="{`/${$clickedSimulation.simulation_id}`}">⟳</a>
    </button>
  {/if}
</div>
