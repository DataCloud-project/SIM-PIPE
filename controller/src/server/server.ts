import { ApolloServer, gql } from 'apollo-server';

import logger from '../logger.js';
import * as functions from './functions.js';

process.env.IS_SIMULATION_RUNNING = 'false';
process.env.CANCEL_RUN_LIST = '';

// all API endpoints
const typeDefs = gql`
  type Query {
      All_Simulations: String
      All_Runs_Steps: String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  }
  type Mutation {
    # TODO: pipeline file as input
    Create_Simulation(model_id:String, name:String): String
    Create_Run_WithInput(simulation_id: String, dsl:String, name:String, sampleInput:[[String]]):
    String
    Start_Run(run_id:String): String
    Stop_Run(run_id:String): String
  }
`;

const resolvers = {
  Query: {
    All_Simulations: functions.allSimulations,
    All_Runs_Steps: functions.allRunsSteps,
    async Get_Simulation_Run_Results(_p: unknown, arguments_: { simulation_id:string,
      run_id:string }):Promise<string> {
      return await functions.getSimulationRunResults(arguments_.simulation_id, arguments_.run_id);
    },
  },
  Mutation: {
    async Create_Simulation(_p: unknown, arguments_: { model_id:string, name:string })
      :Promise<string> {
      try {
        const newSimId = await functions.createSimulation(arguments_.model_id, arguments_.name);
        return `Simulation has been created with id ${newSimId}`;
      } catch (error) {
        const errorMessage = `\n🎌 Internal server error creating new simulation:\n
      ${(error as Error).message}\n`;
        logger.error(errorMessage);
        return 'Failed! Internal server error when creating new simulation';
      }
    },
    async Create_Run_WithInput(_p: unknown, arguments_:
    {
      simulation_id:string,
      dsl:string,
      name:string,
      sampleInput:[[string, string]],
    }):Promise<string> {
      let newRunId;
      try {
        newRunId = await functions.createRunWithInput(
          arguments_.simulation_id, arguments_.dsl, arguments_.name, arguments_.sampleInput);
        return `Run has been created with id ${newRunId}`;
      } catch (error) {
        const errorMessage = `\n🎌 Internal server error creating new run:\n
      ${(error as Error).message}\n`;
        logger.error(errorMessage);
        return 'Failed! Internal server error when creating new run';
      }
    },
    async Start_Run(_p: unknown, arguments_:{ run_id:string }):
    Promise<string> {
      try {
        await functions.queueRun(arguments_.run_id);
        return 'Run has been added to queue';
      } catch (error) {
        const errorMessage = `\n🎌 Failed! internal server error starting run:\n
      ${(error as Error).message}\n`;
        logger.error(errorMessage);
        return 'Failed! internal server error starting run';
      }
    },
    Stop_Run(_p:unknown, arguments_: { run_id:string }):string {
      try {
        functions.stopRun(arguments_.run_id);
        return 'Successfully sent stop signal to current run';
      } catch (error) {
        const errorMessage = `\n🎌 Internal server error stopping run:\n
      ${(error as Error).message}\n`;
        logger.error(errorMessage);
        return 'Failed! internal server error stopping run';
      }
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

// create a sample simulation at startup
logger.info(await functions.createSampleSimulation());
