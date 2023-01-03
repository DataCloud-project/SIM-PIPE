import { error } from '@sveltejs/kit';
import { get_simulation_query } from '../../queries/get_simulation.svelte';
import { get } from 'svelte/store';
import { graphQLClient, clicked_simulation } from '../../stores/stores';

// load details of the clicked simulation
export async function load({ params }) {
	try {
		let { simulation_id } = params;
		// during refresh if simulation id is undefined
		if (simulation_id == 'undefined') {
			simulation_id = get(clicked_simulation).simulation_id;
		}
		const variables = { simulation_id }; // userid from access token
		const result = await get(graphQLClient).request(get_simulation_query, variables);
		const simulation = result.Get_Simulation.simulations[0];
		return {
			simulation
		};
	} catch (error) {
		throw error(500, error.message);
	}
}
