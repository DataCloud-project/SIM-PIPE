import { GraphQLClient, type RequestDocument } from 'graphql-request';
import { graphQLClient } from '../stores/stores';
import { get } from 'svelte/store';
import initKeycloak from './keycloak';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import { GraphQL_API_URL } from './config';

export async function requestGraphQLClient(
	query: RequestDocument | TypedDocumentNode<unknown, any>,
	variables = {}
): Promise<any> {
	if (!get(graphQLClient)) {
		try {
			graphQLClient.set(new GraphQLClient(GraphQL_API_URL, {}));
		} catch {
			// redirect to keycloak authentication
			await initKeycloak();
		}
	}
	return await get(graphQLClient).request(query, variables);
}
