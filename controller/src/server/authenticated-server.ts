/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
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
  type Run {
    run_id: String
    name: String
    status: String
    created: String
    started: String
    ended: String 
  }
  type Simulation {
    simulation_id: String
    name: String
    created: String
    runs: [Run]
    """
    pipeline_description is defined as type string instead of jsonb as the latter requires defining
    most of the elements in the SIM-PIPE json schema as a separate graphql type. 
    """ 
    pipeline_description: String 
  }
  type AllSimulations {
    simulations: [Simulation] 
  }
  input Step {
    name: String
    step_number: Int
    image: String
    env: [String]
    type: String
    prerequisite: [Int]
  }
  input Pipeline_Description {
    steps: [Step]
  }
  type Query {
      All_Runs_Steps: String
      All_Simulations: AllSimulations
      Get_Simulation(simulation_id:String):String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  },
  type Mutation {
    Create_Simulation(model_id:String, name:String, pipeline_description:String): String
    Create_Run_WithInput(simulation_id: String,name:String, sampleInput:[[String]], 
    env_list: [[String]], timeout_value:Int):
    String
    Start_Run(run_id:String): String
    Stop_Run(run_id:String): String
    Delete_Run(run_id:String): String
  }
`;

const resolvers = {
  Query: {
    All_Runs_Steps(_p: unknown, arguments_: unknown, context: { user: any }):unknown {
      return functions.allRunsSteps(context.user.sub as string);
    },
    All_Simulations(_p: unknown, arguments_: unknown, context: { user: any }):unknown {
      return functions.allSimulations(context.user.sub as string);
    },
    Get_Simulation(_p: unknown, arguments_: { simulation_id:string }, context: { user: any }):unknown {
      return functions.getSimulation(context.user.sub as string, arguments_.simulation_id);
    },
    async Get_Simulation_Run_Results(_p: unknown, arguments_: { simulation_id:string,
      run_id:string }, context: { user: any }):Promise<string> {
      return await functions.getSimulationRunResults(arguments_.simulation_id, arguments_.run_id, context.user.sub as string);
    },
  },
  Mutation: {
    async Create_Simulation(_p: unknown, arguments_: { model_id:string, name:string,
      pipeline_description: string }, context: { user: any })
      :Promise<string> {
      try {
        const newSimId = await functions.createSimulation(
          arguments_.model_id, arguments_.name, arguments_.pipeline_description, context.user.sub as string);
        // return `Simulation has been created with id ${newSimId}`;
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
    async Create_Run_WithInput(_p: unknown, arguments_:
    {
      simulation_id:string,
      name:string,
      sampleInput:[[string, string]],
      env_list: [[string]],
      timeout_value: number
    }, context: { user: any }):Promise<string> {
      let newRunId;
      try {
        newRunId = await functions.createRunWithInput(
          arguments_.simulation_id,
          arguments_.name,
          arguments_.sampleInput,
          context.user.sub as string,
          arguments_.env_list,
          arguments_.timeout_value);
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
    async Start_Run(_p: unknown, arguments_:{ run_id:string }, context: { user: any }):
    Promise<string> {
      try {
        await functions.queueRun(arguments_.run_id, context.user.sub as string);
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
    async Stop_Run(_p:unknown, arguments_: { run_id:string }, context: { user: any }):Promise<string> {
      try {
        await functions.stopRun(arguments_.run_id, context.user.sub as string);
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
    async Delete_Run(_p:unknown, arguments_: { run_id:string }, context: { user: any }):Promise<string> {
      try {
        await functions.deleteRun(arguments_.run_id, context.user.sub as string);
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
  },
};

/**
 * middleware definitions
 */
const KEYCLOAK_REALM_ENDPOINT = process.env.KEYCLOAK_REALM_ENDPOINT
  ?? 'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

async function getKeycloakPublicKey() : Promise<string> {
  const response = await got(KEYCLOAK_REALM_ENDPOINT).json<{ public_key: string }>();
  const { public_key: publicKey } = response;
  if (!publicKey) {
    throw new Error('No public key found');
  }
  return `-----BEGIN PUBLIC KEY-----\r\n${publicKey}\r\n-----END PUBLIC KEY-----`;
}

const authenticationExpiryTimeout:number = Number.parseInt(process.env.Authentication_Expiry_Timeout
  || '', 10);
const keycloakPublicKeyCache = new ExpiryMap(authenticationExpiryTimeout);
const getKeycloakPublicKeyWithCache = pMemoize(
  getKeycloakPublicKey, { cache: keycloakPublicKeyCache },
);

const jwtMiddleware = expressjwt({
  secret: getKeycloakPublicKeyWithCache,
  algorithms: ['RS256'],
});

/**
 * function to get hasura url passed in .env file
 */
function getHasuraUrl():string {
  if (!process.env.HASURA_URL) {
    throw new Error('🎌 Remote schema url is not defined in .env file');
  }
  return process.env.HASURA_URL.split('/')[2].split(':')[0];
}

/**
 * function to start server with keycloak authentication
 */
const startSecureServer = async (): Promise<void> => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }): { user: { sub: string; preferred_username: string; }; } => {
      // if (!req.headers.authorization && req.hostname !== getHasuraUrl()) {
      if (!req.headers.authorization) {
        throw new Error('🎌 No authorization header found');
      }
      // definition of user can be extended later to include all required attributes
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const user:{
        sub: string,
        preferred_username: string
      } = jwt_decode(req.headers.authorization);
      return { user };
    },
  });

  try {
    const app = express();
    const chooseMiddleware = (middleware: {
      (request: express.Request, response: express.Response, next: express.NextFunction):
      Promise<void>; unless: any;
    }) => function (request: express.Request, response: express.Response, next: () => any) {
      // console.log(`${request.headers['user-agent'] as string}--------------------\n`);
      // console.log(`${request.hostname}--------------------\n`);
      if (request.hostname === getHasuraUrl()) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return next(); // skip authentication for requests from hasura endpoint
      }
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return middleware(request, response, next);
    };
    app.use(
      chooseMiddleware(jwtMiddleware),
    );

    await server.start();
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await server.applyMiddleware({ app });
    // eslint-disable-next-line @typescript-eslint/await-thenable
    await app.listen({ port: 9000, hostname: '0.0.0.0' },
      () => console.log(`🚀 Server for backends running on http://localhost:9000${server.graphqlPath}`),
    );
  } catch (error) {
    throw new Error(`🎌 Error starting the server\n${error as string}`);
  }
};

await startSecureServer();

// create a sample simulation at startup
logger.info(await functions.createSampleSimulation());
