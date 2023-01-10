import { ApolloServer } from 'apollo-server-express';
import express from 'express';

import typeDefs from './graphql-definitions.js';
import resolvers from './resolvers.js';
import createRouter from './routes.js';

process.env.IS_SIMULATION_RUNNING = 'false';
process.env.CANCEL_RUN_LIST = '';

/**
 * function to start server with keycloak authentication
 */
export default async function startSecureServer(): Promise<void> {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): { user: { sub: string; username: string; }; } => {
      if (!req.headers.authorization) {
        throw new Error('🎌 No authorization header found');
      }
      // definition of user can be extended later to include all required attributes
      const { auth } = req as unknown as {
        auth: { sub: string, preferred_username: string, iat: number, exp: number }
      };
      const { sub, preferred_username: username } = auth;
      const user = { sub, username };
      return { user };
    },
  });

  try {
    const app = express();

    /* app.use(
      jwtMiddleware as express.RequestHandler,
    ); */

    app.use(createRouter());

    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: 9000, hostname: '0.0.0.0' },
      // eslint-disable-next-line no-console
      () => console.log(`🚀 Authenticated server running on http://localhost:9000${server.graphqlPath}`),
    );
  } catch (error) {
    throw new Error(`🎌 Error starting the server\n${error as string}`);
  }
}
