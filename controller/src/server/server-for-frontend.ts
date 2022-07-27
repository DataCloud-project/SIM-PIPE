/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ApolloServer, gql } from 'apollo-server';

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
  }
  type AllSimulations {
    simulations: [Simulation] 
  }
  type Query {
      All_Simulations(userid:String): AllSimulations
      Get_Simulation(userid:String, simulation_id:String):AllSimulations
      All_Runs_Steps: String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  }
`;

const resolvers = {
  Query: {
    All_Simulations(_p: unknown, arguments_: { userid:string }):unknown {
      return functions.allSimulations(arguments_.userid);
    },
    Get_Simulation(_p: unknown, arguments_: { userid:string, simulation_id:string }):unknown {
      return functions.getSimulation(arguments_.userid, arguments_.simulation_id);
    },
    All_Runs_Steps: functions.allRunsSteps,
    async Get_Simulation_Run_Results(_p: unknown, arguments_: { simulation_id:string,
      run_id:string }):Promise<string> {
      return await functions.getSimulationRunResults(arguments_.simulation_id, arguments_.run_id);
    },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });
try {
  await server.listen({ port: 9000, hostname: '0.0.0.0' }).then(({ url }) => {
    // eslint-disable-next-line no-console
    logger.info(`🚀 Server ready at ${url}`);
  });
} catch (error) {
  const errorMessage = `\n 🎌 Error starting GraphQL server:\n
      ${(error as Error).message} \nCheck GraphQL server host and port\n`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

await functions.createSampleSimulation();
