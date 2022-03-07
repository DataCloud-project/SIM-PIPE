import { ApolloServer, gql } from 'apollo-server';

import logger from '../logger.js';
import * as functions from './functions.js';
// schema
const typeDefs = gql`
  type Query {
      All_Simulations: String
      All_Runs_Steps: String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  }
  type Mutation {
    Create_Simulation(model_id:String, name:String): String
    Create_Run(simulation_id: String, dsl:String, name:String): String
    Create_Run_WithInput(simulation_id: String, dsl:String, name:String, sampleInput:[[String]]):
     String
    Start_Run(run_id:String): String
    #TODO: implement 
    # Stop_Step(step_id:Int): String
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
      return await functions.createSimulation(arguments_.model_id, arguments_.name);
    },
    async Create_Run(_p: unknown, arguments_: { simulation_id:string, dsl:string, name:string })
      :Promise<string> {
      return await functions.createRun(arguments_.simulation_id, arguments_.dsl, arguments_.name);
    },
    async Create_Run_WithInput(_p: unknown, arguments_:
    {
      simulation_id:string,
      dsl:string,
      name:string,
      sampleInput:[[string, string]],
    }):Promise<string> {
      logger.info(arguments_.sampleInput);
      return await functions.createRunWithInput(
        arguments_.simulation_id, arguments_.dsl, arguments_.name, arguments_.sampleInput);
    },
    async Start_Run(_p: unknown, arguments_:{ run_id:string }):
    Promise<string> {
      // TODO: queue to follow
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      functions.startRun(arguments_.run_id);
      return 'ok';
    },
    // Stop_Step():string {
    //   // TODO
    //   return 'stop the step';
    // },
    Stop_Run(_p:unknown, arguments_: { run_id:string }):string {
      // TODO
      functions.stopRun(arguments_.run_id);
      return 'ok';
    },
  },
};

// TODO: dockerize backend

const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000, hostname: '0.0.0.0' }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});

// const runid = await functions.createRunWithInput('fbaf05f3-93ad-4df3-9429-095850b55eae',
//  'n', 'n', [['n1', 'content1'], ['n2', 'content2']]);
// const runid = await functions.createRun('fbaf05f3-93ad-4df3-9429-095850b55eae',
// "{\"dsl\" : \"second sample\"}");
// await functions.startRun(runid);
