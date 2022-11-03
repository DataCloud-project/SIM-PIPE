import { writable, readable } from 'svelte/store';
import { GraphQLClient } from 'graphql-request';

/**
 * username of the currently logged in user
 */
export let username = writable('');
/**
 * indicators to show if a run or step is clicked
 */
export let show_steps_list = writable(false);
export let show_usages = writable(false);
/**
 * clicked resource handlers
 */
export let clicked_simulation = writable('');
export let clicked_run = writable('');
export let clicked_step = writable('');
/**
 * extracted resources of clicked items
 */
export let simulations_list = writable([]);
export let steps_list = writable([]);
export let selected_resource_usage = writable([]);
export let selected_logs = writable('');

// graphql client from graphql-request
// export const graphQLClient = writable(new GraphQLClient('http://localhost:9000/graphql'));
export const graphQLClient = writable('');
