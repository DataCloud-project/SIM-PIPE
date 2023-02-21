import { get } from 'svelte/store';
import initKeycloak from '../../utils/keycloak.js';
import getSimulationQuery from '../../queries/get-simulation.js';
import { clickedSimulation, graphQLClient } from '../../stores/stores.js';
import type { Simulation } from '../../types';
// eslint-disable-next-line import/extensions
import { browser } from '$app/environment';

// load details of the clicked simulation
export async function load({
  params,
}: {
  params: { simulation_id?: string };
}): Promise<{ simulation: Simulation } | undefined> {
  if (!browser) {
    return undefined;
  }

  await initKeycloak();
  let id = params.simulation_id;
  if (!id) {
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
}
