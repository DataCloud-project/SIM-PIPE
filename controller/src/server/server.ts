import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import morgan from 'morgan';

import typeDefs from './graphql-definitions.js';
import jwtMiddleware from './jwt-middleware.js';
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
      // definition of user can be extended later to include all required attributes
      const { auth } = req as unknown as {
        auth: { sub: string, preferred_username: string, iat: number, exp: number }
      };
      if (!auth) {
        throw new Error('🎌 No auth found');
      }
      const { sub, preferred_username: username } = auth;
      const user = { sub, username };
      return { user };
    },
  });

  try {
    const app = express();

    // Setup logging middleware with morgan
    app.use(morgan('combined'));

    app.use(createRouter());

    app.use(
      jwtMiddleware as express.RequestHandler,
    );
    await server.start();
    server.applyMiddleware({ app, path: '/graphql' });
    app.listen({ port: 9000, hostname: '0.0.0.0' },
      // eslint-disable-next-line no-console
      () => console.log(`🚀 Authenticated server running on http://localhost:9000${server.graphqlPath}`),
    );
  } catch (error) {
    throw new Error(`🎌 Error starting the server\n${error as string}`);
  }
}
