/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLClient } from 'graphql-request';

import { getSdk } from '../db/database.js';
import logger from '../logger.js';
// import * as controller from '../controller.js';

// schema
const typeDefs = gql`
  type Query {
      All_Simulations: String
      # Start: String
  }
  type Mutation {
    Create_Run(simulation_id: String): String
    Create_Step(run_id: String, name:String): String
  }
`;

const client = new GraphQLClient('http://127.0.0.1:8080/v1/graphql', {
  headers: {
    'x-hasura-admin-secret': 'hasuraadminsecret',
  },
});
const sdk = getSdk(client);

// TODO:
// create new step - done
// start new step
// start new run - dsl argument
// stop container - stop current running step 
// stop run -- later

async function allSimulations():Promise<string> {
  const result1 = JSON.stringify(await sdk.AllSimulations());
  return result1;
}
async function createRun(simulation_id:string):Promise<string> {
  const result = await sdk.startNewRun({
    simulation_id: simulation_id,
  });
  // await controller.start();
  // queue to follow
  if (!result.start_run?.run_id) {
    throw new Error('Undefined results from all_simulations');
  }
  logger.info(`Run created with id ${result.start_run.run_id}`);
  return result.start_run.run_id;
}
async function createStep(run_id:string, name:string):Promise<string> {
  const result = await sdk.createStep({
  run_id: run_id,
  name: name,
  });
  if (!result.insert_steps_one?.step_id) {
    throw new Error('Undefined results from createStep');
  }
  logger.info(`Step created with id ${result.insert_steps_one.step_id}`);
  return result.insert_steps_one.step_id;
}

const resolvers = {
  Query: {
    All_Simulations: allSimulations,
    // stop
  },
  Mutation: {
    async Create_Run (parent, args:any):Promise<string> {
      const run_id:string = await createRun(args.simulation_id);
      return run_id;
    },
    async Create_Step (parent, args:any):Promise<string> {
      const step_id:string = await createStep(args.run_id, args.name);
      return step_id+'';
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
