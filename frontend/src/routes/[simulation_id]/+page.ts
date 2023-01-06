import { get } from 'svelte/store';
import getSimulationQuery from '../../queries/get-simulation.js';
import { clickedSimulation, graphQLClient } from '../../stores/stores.js';
import type { Simulation } from 'src/types';

// load details of the clicked simulation
export default async function load(simulationId?: string): Promise<{ simulation: Simulation }> {
  try {
    let id = simulationId;
    if (!simulationId) {
      id = get(clickedSimulation)?.simulation_id;
    }
    if (!id) {
      throw new Error('No simulation id provided');
    }
    const variables = { simulation_id: id }; // userid from access token
    const result = await get(graphQLClient).request<{
      Get_Simulation: {
        simulations: Simulation[];
      };
    }>(getSimulationQuery, variables);

    const simulation = result.Get_Simulation.simulations[0];
    return {
      simulation,
    };
  } catch (error) {
    throw new Error('500', { cause: error });
  }
}
