import { graphQLClient } from '../stores/stores';
import { get } from 'svelte/store';
import initKeycloak from '../utils/keycloak.client';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { RequestDocument, Variables } from 'graphql-request';

export async function requestGraphQLClient<T, V extends Variables = Variables>(
	query: RequestDocument | TypedDocumentNode<T, V>,
	variables: V = {} as V
): Promise<T> {
	if (!get(graphQLClient)) {
		await initKeycloak();
	}
	return await get(graphQLClient).request<T>(query, variables);
}
