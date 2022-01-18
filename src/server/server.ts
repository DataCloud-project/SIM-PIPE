/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer, gql } from 'apollo-server';
import { GraphQLClient } from 'graphql-request';
import GraphQLJSON from 'graphql-type-json';


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
    Create_Run(simulation_id: String, dsl:String): String
    Create_Step(run_id: String, name:String, image:String, pipeline_step_number:Int): String
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
  const result:string = JSON.stringify(await sdk.AllSimulations());
  return result;
}
async function createRun(simulation_id:string, dsl:string):Promise<string> {
  const result = await sdk.createRun({
    simulation_id,
    dsl: JSON.parse(dsl),
  });
  // await controller.start();
  // queue to follow
  if (!result.start_run?.run_id) {
    throw new Error('Undefined results from all_simulations');
  }
  logger.info(`Run created with id ${result.start_run.run_id}`);
  return result.start_run.run_id;
}
async function createStep(run_id:string, name:string, image:string,
  pipeline_step_number:int):Promise<string> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const result = await sdk.createStep({
    run_id,
    name,
    image,
    pipeline_step_number,
  });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
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
    async Create_Run(parent, arguments_):Promise<string> {
      return await createRun(arguments_.simulation_id, arguments_.dsl);
    },
    async Create_Step(parent, arguments_):Promise<string> {
      return `${await createStep(arguments_.run_id, arguments_.name, arguments_.image, 
        arguments_.pipeline_step_number)}`;
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
