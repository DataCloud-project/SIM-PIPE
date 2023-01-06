import { writable } from 'svelte/store';
import type { GraphQLClient } from 'graphql-request';
import type { ResourceUsage, Run, Simulation, Step } from 'src/types';

/**
 * username of the currently logged in user
 */
export const username = writable('');
/**
 * indicators to show if a run or step is clicked
 */
export const showStepsList = writable(false);
export const showUsages = writable(false);
/**
 * clicked resource handlers
 */
export const clickedSimulation = writable<Simulation | undefined>(undefined);
export const clickedRun = writable<Run | undefined>(undefined);
export const clickedStep = writable<Step | undefined>(undefined);
/**
 * extracted resources of clicked items
 */
export const simulationsList = writable<Simulation[] | undefined>(undefined);
export const stepsList = writable<Step[]>([]);
export const selectedResourceUsage = writable<ResourceUsage[]>([]);
export const selectedLogs = writable('');

// graphql client from graphql-request
export const graphQLClient = writable<GraphQLClient>();
