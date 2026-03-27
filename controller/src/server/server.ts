import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import createApolloGraphqlServer from './apollo-graphql.js';
import authJwtMiddleware from './auth-jwt-middleware.js';
import createRouter from './routes.js';
import type ArgoWorkflowClient from '../argo/argo-client.js';
import type K8sClient from '../k8s/k8s-client.js';

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

  // CORS must be applied before helmet so it sets Access-Control-Allow-Origin first.
  // helmet() sets Cross-Origin-Resource-Policy: same-origin by default which would
  // override CORS and block the browser from reading cross-origin responses.
  app.use(cors({
    origin: true,           // Reflects the request origin (supports any origin including localhost)
    credentials: true,      // Allow Authorization header
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Setup security middleware with helmet — disable crossOriginResourcePolicy so it
  // doesn't conflict with CORS (CORP: same-origin blocks cross-origin reads).
  app.use(helmet({ crossOriginResourcePolicy: false }));

  // Setup logging middleware with morgan
  app.use(morgan('combined'));

  // Load the router
  app.use(createRouter());

  // Start the Apollo GraphQL server and apply it to the Express app
  const {
    server: graphqlServer,
    requestHandler: graphqlRequestHandler,
  } = await createApolloGraphqlServer({
    argoClient,
    k8sClient,
  });
  await graphqlServer.start();
  app.use(authJwtMiddleware);
  // increase size limit to allow larger file uploads (createNewDryRun)
  app.use(express.json({ limit: '5mb' }));

  app.use('/graphql', bodyParser.json(), graphqlRequestHandler());

  // Start the Express server
  app.listen({ port: 9000 },
    // eslint-disable-next-line no-console
    () => console.log('🚀 Server running on http://localhost:9000'),
  );
}
