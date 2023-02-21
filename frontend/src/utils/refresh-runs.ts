import { get } from 'svelte/store';

import getSimulationQuery from '../queries/get-simulation.js';
import { clickedRun, clickedSimulation, graphQLClient, stepsList } from '../stores/stores.js';
import type { Simulation } from '../types';

let refreshActiveRunsPromise: Promise<void> | undefined;
let currentRefreshedSimulationId: string | undefined;

export default function refreshActiveRuns(): void {
  const simulation = get(clickedSimulation);
  if (!simulation) {
    throw new Error('No simulation is selected');
  }
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { simulation_id } = simulation;

  if (refreshActiveRunsPromise !== undefined && currentRefreshedSimulationId === simulation_id) {
    // already refreshing
    return;
  }

  refreshActiveRunsPromise = (async function waitForCompletion(): Promise<void> {
    let noActiveRunsIndicator = false;
    /* eslint-disable no-await-in-loop */
    do {
      const result = await get(graphQLClient).request<{
        Get_Simulation: {
          simulations: Simulation[];
        };
      }>(getSimulationQuery, { simulation_id });
      const refreshedSimulation = result.Get_Simulation.simulations[0];

      if (
        !refreshedSimulation ||
        refreshedSimulation.simulation_id !== currentRefreshedSimulationId
      ) {
        // simulation is not the same as the one we are refreshing
        return;
      }

      clickedSimulation.set(refreshedSimulation);
      // update steps list
      const currentlyClickedRun = get(clickedRun);
      const runs = get(clickedSimulation)?.runs ?? [];
      if (currentlyClickedRun !== undefined) {
        runs.every((run) => {
          if (run.run_id === currentlyClickedRun.run_id) {
            // update run
            clickedRun.set(run);
            if (run.steps) {
              stepsList.set(run.steps);
            }
            return false;
          }
          return true;
        });
      }
      noActiveRunsIndicator = runs.every(
        (run) => run.status === 'active' || run.status === 'queued',
      );
      // Stop refreshing if there are no active runs
      if (noActiveRunsIndicator) {
        refreshActiveRunsPromise = undefined;
        currentRefreshedSimulationId = undefined;
        return;
      }

      // wait for 5 seconds and check again
      await new Promise((resolve) => {
        setTimeout(resolve, 5000);
      });
    } while (!noActiveRunsIndicator && currentRefreshedSimulationId === simulation_id);
    /* eslint-enable no-await-in-loop */
  })();
}
