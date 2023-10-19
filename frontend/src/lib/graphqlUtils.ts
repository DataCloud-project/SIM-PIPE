import type RequestDocument from 'graphql-request';
import { graphQLClient } from '../stores/stores';
import { get } from 'svelte/store';
import initKeycloak from '../utils/keycloak.client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';

export async function requestGraphQLClient(
	query: typeof RequestDocument | TypedDocumentNode<unknown, any>,
	variables = {}
): Promise<any> {
	if (!get(graphQLClient)) {
		await initKeycloak();
	}
	return await get(graphQLClient).request(query, variables);
}
