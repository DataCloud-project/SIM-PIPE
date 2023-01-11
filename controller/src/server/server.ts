import express from 'express';
import morgan from 'morgan';

import createApolloGraphqlServer from './apollo-graphql.js';
import { hybridAuthJwtMiddleware } from './auth-jwt-middleware.js';
import createRouter from './routes.js';

/**
 * function to start server with keycloak authentication
 */
export default async function startSecureServer(): Promise<void> {
  const app = express();

  const graphqlServer = createApolloGraphqlServer();

  // Setup logging middleware with morgan
  app.use(morgan('combined'));

  // Parse JSON body (temporary)
  app.use(express.json());

  // Load the router
  app.use(createRouter());

  // Start the Apollo GraphQL server and apply it to the Express app
  await graphqlServer.start();
  app.use(hybridAuthJwtMiddleware);
  graphqlServer.applyMiddleware({ app, path: '/graphql' });

  // Start the Express server
  app.listen({ port: 9000, hostname: '0.0.0.0' },
    // eslint-disable-next-line no-console
    () => console.log('🚀 Server running on http://localhost:9000'),
  );
}
