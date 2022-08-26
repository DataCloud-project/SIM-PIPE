/**
 * unused server for frontend
 * frontend and the other backends uses authenticated-server.ts
 */
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
  type AllSimulations {
    simulations: [Simulation] 
  }
  type Query {
      All_Simulations(userid:String): AllSimulations
      Get_Simulation(userid:String, simulation_id:String):String
      All_Runs_Steps: String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  }  
  type Mutation {
    Create_Simulation(model_id:String, name:String, pipeline_description:String, userid:String): String
    Create_Run_WithInput(simulation_id: String, dsl:String, name:String, sampleInput:[[String]],
    userid:String, env_list: [[String]], timeout_value:Int):
    String
    Start_Run(run_id:String, userid:String): String
    Stop_Run(run_id:String, userid:String): String
    Delete_Run(run_id:String, userid:String): String
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
      run_id:string, userid:string }):Promise<string> {
      return await functions.getSimulationRunResults(arguments_.simulation_id, arguments_.run_id, arguments_.userid);
    },
  },
  Mutation: {
    async Create_Simulation(_p: unknown, arguments_: { model_id:string, name:string,
      pipeline_description: string, userid:string })
      :Promise<string> {
      try {
        const newSimId = await functions.createSimulation(
          arguments_.model_id, arguments_.name, arguments_.pipeline_description, arguments_.userid);
        return JSON.stringify({
          code: 200,
          message: `Simulation has been created with id ${newSimId}`,
        });
      } catch (error) {
        const errorMessage = `🎌 Error creating new simulation:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        // return 'Failed! Internal server error when creating new simulation';
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Create_Run_WithInput(_p: unknown, arguments_:
    {
      simulation_id:string,
      dsl:string,
      name:string,
      sampleInput:[[string, string]],
      userid:string,
      env_list: [[string]],
      timeout_value: number
    }):Promise<string> {
      let newRunId;
      try {
        newRunId = await functions.createRunWithInput(
          arguments_.simulation_id,
          arguments_.dsl,
          arguments_.name,
          arguments_.sampleInput,
          arguments_.userid,
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
        // return 'Failed! Internal server error when creating new run';
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Start_Run(_p: unknown, arguments_:{ run_id:string, userid:string }):
    Promise<string> {
      try {
        await functions.queueRun(arguments_.run_id, arguments_.userid);
        return JSON.stringify({
          code: 200,
          message: 'Run has been added to queue',
        });
      } catch (error) {
        const errorMessage = `🎌 Failed! Error starting run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        // return 'Failed! internal server error starting run';
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Stop_Run(_p:unknown, arguments_: { run_id:string, userid:string }):Promise<string> {
      try {
        await functions.stopRun(arguments_.run_id, arguments_.userid);
        return JSON.stringify({
          code: 200,
          message: 'Successfully sent stop signal to current run',
        });
      } catch (error) {
        const errorMessage = `🎌 Error stopping run:
      ${(error as Error).message}`;
        logger.error(errorMessage);
        // return 'Failed! internal server error stopping run';
        return JSON.stringify({
          code: 300,
          message: errorMessage,
        });
      }
    },
    async Delete_Run(_p:unknown, arguments_: { run_id:string, userid:string }):Promise<string> {
      try {
        await functions.deleteRun(arguments_.run_id, arguments_.userid);
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

const server = new ApolloServer({ typeDefs, resolvers });
try {
  await server.listen({ port: 9000, hostname: '0.0.0.0' }).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀 Server for frontend ready at ${url}`);
  });
} catch (error) {
  const errorMessage = `\n 🎌 Error starting GraphQL server:\n
      ${(error as Error).message} \nCheck GraphQL server host and port\n`;
  logger.error(errorMessage);
  throw new Error(errorMessage);
}

await functions.createSampleSimulation();
