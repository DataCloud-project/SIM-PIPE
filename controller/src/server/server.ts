import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import createApolloGraphqlServer from './apollo-graphql.js';
import { hybridAuthJwtMiddleware } from './auth-jwt-middleware.js';
import createRouter from './routes.js';

/**
 * Create and start the Express server.
 *
 * It starts an Apollo GraphQL server and applies it to the Express app.
 * It also starts a classic small REST API.
 */
export default async function startSecureServer(): Promise<void> {
  const app = express();

  // Setup security middleware with helmet
  app.use(helmet());

  // Setup logging middleware with morgan
  app.use(morgan('combined'));

  // Load the router
  app.use(createRouter());

  // Start the Apollo GraphQL server and apply it to the Express app
  const graphqlServer = await createApolloGraphqlServer();
  await graphqlServer.start();
  app.use(hybridAuthJwtMiddleware);
  graphqlServer.applyMiddleware({ app, path: '/graphql' });

  // Start the Express server
  app.listen({ port: 9000 },
    // eslint-disable-next-line no-console
    () => console.log('🚀 Server running on http://localhost:9000'),
  );
}
