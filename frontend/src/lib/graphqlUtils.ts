import { get } from 'svelte/store';
import type { TypedDocumentNode } from '@graphql-typed-document-node/core';
import type { RequestDocument, Variables } from 'graphql-request';
import initKeycloak, { ensureFreshToken } from '../utils/keycloak.client';
import { graphQLClient } from '$stores/stores';

export class GraphQLRequestError extends Error {
	constructor(
		message: string,
		public readonly statusCode?: number
	) {
		super(message);
		this.name = 'GraphQLRequestError';
	}
}

export async function requestGraphQLClient<T, V extends Variables = Variables>(
	query: RequestDocument | TypedDocumentNode<T, V>,
	variables: V = {} as V
): Promise<T> {
	if (!get(graphQLClient)) {
		try {
			await initKeycloak();
		} catch (keycloakError: unknown) {
			const msg = keycloakError instanceof Error ? keycloakError.message : String(keycloakError);
			console.error('[graphqlUtils] Keycloak init failed:', msg);
			throw new GraphQLRequestError(`Authentication failed: ${msg}`, 401);
		}
	}
	const client = get(graphQLClient);
	if (!client) {
		// initKeycloak triggered a login redirect; suspend until navigation completes.
		return await new Promise<never>(() => {});
	}
	try {
		return await client.request<T>(query, variables);
	} catch (error: unknown) {
		// On 401, attempt one token refresh and retry before giving up
		const errStatus = (error as { response?: { status?: number } }).response?.status;
		if (errStatus === 401) {
			await ensureFreshToken();
			const freshClient = get(graphQLClient);
			if (freshClient) {
				try {
					return await freshClient.request<T>(query, variables);
				} catch (error_: unknown) {
					// eslint-disable-next-line no-ex-assign
					error = error_;
				}
			}
		}
		// graphql-request v6's ClientError constructor can itself throw a TypeError
		// (Cannot read properties of undefined (reading 'message')) when the server
		// returns a non-JSON or empty-errors-array response (e.g. plain-text 401).
		// Normalise all such failures into a predictable GraphQLRequestError so
		// callers can handle them cleanly without crashing.
		if (error instanceof TypeError && error.message.includes("reading 'message'")) {
			throw new GraphQLRequestError(
				'Request failed: server returned an unexpected response (possibly 401 Unauthorized). Check controller logs.'
			);
		}
		// Re-extract a clean message from a well-formed ClientError
		const clientErr = error as {
			response?: { status?: number; errors?: { message: string }[] };
			message?: string;
		};
		const status = clientErr.response?.status;
		const gqlMessage =
			clientErr.response?.errors?.[0]?.message ?? clientErr.message ?? 'Unknown error';
		throw new GraphQLRequestError(gqlMessage, status);
	}
}
