import { ApolloServer } from 'apollo-server-express';

import typeDefs from './graphql-definitions.js';
import resolvers from './resolvers.js';
import type { Auth } from './auth-jwt-middleware.js';
import type { Context } from './resolvers.js';

export default function createApolloGraphqlServer(): ApolloServer {
  return new ApolloServer({
    typeDefs,
    resolvers,
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
