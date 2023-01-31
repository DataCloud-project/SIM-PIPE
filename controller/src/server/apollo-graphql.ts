import { loadFiles } from '@graphql-tools/load-files';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { ApolloServer } from 'apollo-server-express';
import { fileURLToPath } from 'node:url';

import { authDirectiveTransformer, authDirectiveTypeDefs } from './auth-directive.js';
import resolvers from './resolvers.js';
import type { Auth } from './auth-jwt-middleware.js';
import type { Context } from './resolvers.js';

export default async function createApolloGraphqlServer(): Promise<ApolloServer> {
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
      if (auth) {
        const { sub, name: username } = auth;
        const user = { sub, username };
        return { user };
      }
      return { user: undefined };
    },
    introspection: true,
  });
}
