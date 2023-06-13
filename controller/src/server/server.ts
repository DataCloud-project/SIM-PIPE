import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import type K8sClient from 'k8s/k8s-client.js';

import createApolloGraphqlServer from './apollo-graphql.js';
import authJwtMiddleware from './auth-jwt-middleware.js';
import createRouter from './routes.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';

/**
 * Create and start the Express server.
 *
 * It starts an Apollo GraphQL server and applies it to the Express app.
 * It also starts a classic small REST API.
 */
export default async function startSecureServer({
  argoClient,
  k8sClient,
}: {
  argoClient: ArgoWorkflowClient,
  k8sClient: K8sClient,
}): Promise<void> {
  const app = express();

  // Setup security middleware with helmet
  app.use(helmet());

  // Setup logging middleware with morgan
  app.use(morgan('combined'));

  // Load the router
  app.use(createRouter());

  // Start the Apollo GraphQL server and apply it to the Express app
  const graphqlServer = await createApolloGraphqlServer({
    argoClient,
    k8sClient,
  });
  await graphqlServer.start();
  app.use(authJwtMiddleware);
  graphqlServer.applyMiddleware({ app, path: '/graphql' });

  // Start the Express server
  app.listen({ port: 9000 },
    // eslint-disable-next-line no-console
    () => console.log('🚀 Server running on http://localhost:9000'),
  );
}
