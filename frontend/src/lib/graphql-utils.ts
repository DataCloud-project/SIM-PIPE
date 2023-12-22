import { get } from 'svelte/store';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { RequestDocument, Variables } from 'graphql-request';

import { graphQLClient } from '../stores/stores';
import initKeycloak from '../utils/keycloak.client';

export async function requestGraphQLClient<T, V extends Variables = Variables>(
	query: RequestDocument | TypedDocumentNode<T, V>,
	variables: V = {} as V
): Promise<T> {
	if (!get(graphQLClient)) {
		await initKeycloak();
	}
	return get(graphQLClient).request<T>(query, variables);
}
