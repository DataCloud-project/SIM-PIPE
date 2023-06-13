import { writable } from 'svelte/store';
import type { GraphQLClient } from 'graphql-request';

export const graphQlClient = writable<GraphQLClient>();
