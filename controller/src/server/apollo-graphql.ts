import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { fileURLToPath } from 'node:url';
import type { CoreV1Api } from '@kubernetes/client-node';

import { kubernetesNamespace } from '../config.js';
import { authDirectiveTransformer, authDirectiveTypeDefs } from './auth-directive.js';
import resolvers from './resolvers.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type { Auth } from './auth-jwt-middleware.js';
import type { Context } from './resolvers.js';

export default async function createApolloGraphqlServer({
  argoClient,
  k8sClient,
}: {
  argoClient: ArgoWorkflowClient,
  k8sClient: CoreV1Api,
}): Promise<ApolloServer> {
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

  return new ApolloServer({
    schema,
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
    introspection: true,
    persistedQueries: false,
  });
}
