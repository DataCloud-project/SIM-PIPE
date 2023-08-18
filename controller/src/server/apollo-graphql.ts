import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { fileURLToPath } from 'node:url';
import type { RequestHandler } from 'express';

import { kubernetesNamespace } from '../config.js';
import { authDirectiveTransformer, authDirectiveTypeDefs } from './auth-directive.js';
import resolvers from './resolvers.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';
import type { Auth } from './auth-jwt-middleware.js';
import type { Context } from './resolvers.js';

interface ApolloServerRequestHandlerTuple {
  server: ApolloServer;
  requestHandler: () => RequestHandler;
}

export default async function createApolloGraphqlServer({
  argoClient,
  k8sClient,
}: {
  argoClient: ArgoWorkflowClient,
  k8sClient: K8sClient,
}): Promise<ApolloServerRequestHandlerTuple> {
  const typeDefsPaths = fileURLToPath(new URL('schema.graphql', import.meta.url));
  const typeDefs = await loadFiles(typeDefsPaths);

  let schema = makeExecutableSchema<unknown>({
    typeDefs: [
      authDirectiveTypeDefs,
      typeDefs,
    ],
    resolvers,
  });

  schema = authDirectiveTransformer(schema);

  const server = new ApolloServer({
    schema,
    introspection: true,
    persistedQueries: false,
  });

  return {
    server,
    requestHandler: () => expressMiddleware(server, {
      context: async ({ req }): Promise<Context> => {
        // Load the authentication header if it's present and set the context accordingly
        const { auth } = req as unknown as { auth?: Auth };
        let user;
        if (auth) {
          const { sub, name: username } = auth;
          user = { sub, username };
        }
        return {
          user,
          argoClient,
          k8sClient,
          k8sNamespace: kubernetesNamespace,
        };
      },
    }),
  };
}
