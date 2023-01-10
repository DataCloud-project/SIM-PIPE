import { gql } from 'apollo-server';
import { ApolloServer } from 'apollo-server-express';
import ExpiryMap from 'expiry-map';
import express from 'express';
import { expressjwt } from 'express-jwt';
import got from 'got';
import jwt_decode from 'jwt-decode';
import pMemoize from 'p-memoize';

import logger from '../logger.js';
import * as functions from './functions.js';

process.env.IS_SIMULATION_RUNNING = 'false';
process.env.CANCEL_RUN_LIST = '';

/**
 * graphql query and resolvers
 */
const typeDefs = gql`
  scalar JSON
  # The queries are only available through Hasura
  type Query {},
  type Mutation {
    Create_Simulation(name:String, pipeline_description:String): String
    Create_Run_WithInput(simulation_id: String,name:String, sampleInput:[[String]],
    env_list: [[String]], timeout_values:[Int]):
    String
    Start_Run(run_id:String): String
    Stop_Run(run_id:String): String
    Delete_Run(run_id:String): String
    Delete_Simulation(simulation_id:String): String
  }
`;

interface Context {
  user: {
    sub: string
    preferred_username: string
  }
}

const resolvers = {
  Query: {},
  Mutation: {
    async Create_Simulation(_p: unknown, arguments_: {
      name: string,
      pipeline_description: string
    }, context: Context)
      : Promise<string> {
      try {
        const newSimId = await functions.createSimulation(
          arguments_.name, arguments_.pipeline_description, context.user.sub);
        return JSON.stringify({
          code: 200,
          message: `Simulation has been created with id ${newSimId}`,
        });
      } catch (error) {
        const errorMessage = `🎌 Error creating new simulation:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Create_Run_WithInput(
      _p: unknown, arguments_: {
        simulation_id: string,
        name: string,
        sampleInput: [[string, string]],
        env_list: [[string]],
        timeout_values: [number]
      },
      context: Context,
    ): Promise<string> {
      let newRunId;
      try {
        newRunId = await functions.createRunWithInput(
          arguments_.simulation_id,
          arguments_.name,
          arguments_.sampleInput,
          context.user.sub,
          arguments_.env_list,
          arguments_.timeout_values);
        return JSON.stringify({
          code: 200,
          message: `Run has been created with id ${newRunId}`,
        });
      } catch (error) {
        const errorMessage = `🎌 Error creating new run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Start_Run(
      _p: unknown, arguments_: { run_id: string }, context: Context,
    ): Promise<string> {
      try {
        await functions.queueRun(arguments_.run_id, context.user.sub);
        return JSON.stringify({
          code: 200,
          message: 'Run has been added to queue',
        });
      } catch (error) {
        const errorMessage = `🎌 Failed! Error starting run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Stop_Run(_p: unknown, arguments_: { run_id: string }, context: Context): Promise<string> {
      try {
        await functions.stopRun(arguments_.run_id, context.user.sub);
        return JSON.stringify({
          code: 200,
          message: 'Successfully sent stop signal to current run',
        });
      } catch (error) {
        const errorMessage = `🎌 Error stopping run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Delete_Run(
      _p: unknown, arguments_: { run_id: string }, context: Context,
    ): Promise<string> {
      try {
        await functions.deleteRun(arguments_.run_id, context.user.sub);
        return JSON.stringify({
          code: 200,
          message: 'Successfully deleted run',
        });
      } catch (error) {
        const errorMessage = `🎌 Error deleting run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Delete_Simulation(
      _p: unknown, arguments_: { simulation_id: string }, context: Context,
    ): Promise<string> {
      try {
        await functions.deleteSimulation(arguments_.simulation_id, context.user.sub);
        return JSON.stringify({
          code: 200,
          message: 'Successfully deleted simulation',
        });
      } catch (error) {
        const errorMessage = `🎌 Error deleting simulation:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
  },
};

/**
 * middleware definitions
 */
const KEYCLOAK_REALM_ENDPOINT = process.env.KEYCLOAK_REALM_ENDPOINT
  ?? 'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

async function getKeycloakPublicKey(): Promise<string> {
  const response = await got(KEYCLOAK_REALM_ENDPOINT).json<{ public_key: string }>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  return `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;
}

const authenticationExpiryTimeout: number = Number.parseInt(
  process.env.Authentication_Expiry_Timeout || '', 10);
const keycloakPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

const jwtMiddleware = expressjwt({
  secret: getKeycloakPublicKeyWithCache,
  algorithms: ['RS256'],
});

/**
 * function to start server with keycloak authentication
 */
const startSecureServer = async (): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): { user: { sub: string; preferred_username: string; }; } => {
      if (!req.headers.authorization) {
        throw new Error('🎌 No authorization header found');
      }
      // definition of user can be extended later to include all required attributes
      const user: {
        sub: string,
        preferred_username: string
      } = jwt_decode(req.headers.authorization);
      return { user };
    },
  });

  try {
    const app = express();
    // error handling

    app.use((request, response, next) => {
      if (request.path === '/health') {
        response.sendStatus(204);
      } else {
        next();
      }
    });

    app.use(
      // jwt-express middleware returns a promise that is ignored by express < 5
      jwtMiddleware as express.RequestHandler,
    );

    await server.start();
    server.applyMiddleware({ app });
    app.listen({ port: 9000, hostname: '0.0.0.0' },
      // eslint-disable-next-line no-console
      () => console.log(`🚀 Authenticated server running on http://localhost:9000${server.graphqlPath}`),
    );
  } catch (error) {
    throw new Error(`🎌 Error starting the server\n${error as string}`);
  }
};

await startSecureServer();
