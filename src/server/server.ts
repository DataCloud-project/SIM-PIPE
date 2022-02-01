import { ApolloServer, gql } from 'apollo-server';

import * as functions from './functions.js';
// schema
const typeDefs = gql`
  type Query {
      All_Simulations: String
      All_Runs_Steps: String
      Get_Simulation_Run_Results(simulation_id: String, run_id:String): String
  }
  type Mutation {
    Create_Simulation(model_id:String): String
    Create_Run(simulation_id: String, dsl:String): String
    Start_Run(run_id:String): String
    #TODO: implement 
    # Stop_Step(step_id:Int): String
    # Stop_Run(run_id:String): String
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
    async Create_Simulation(_p: unknown, arguments_: { model_id:string }):Promise<string> {
      return await functions.createSimulation(arguments_.model_id);
    },
    async Create_Run(_p: unknown, arguments_: { simulation_id:string, dsl:string })
      :Promise<string> {
      return await functions.createRun(arguments_.simulation_id, arguments_.dsl);
    },
    async Start_Run(_p: unknown, arguments_:{ run_id:string }):Promise<string> {
      // TODO: queue to follow
      return await functions.startRun(arguments_.run_id);
    },
    // Stop_Step():string {
    //   // TODO
    //   return 'stop the step';
    // },
    // Stop_Run():string {
    //   // TODO
    //   return 'stop all steps in the run';
    // },
  },
};

// TODO: dockerize backend

const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000 }).then(({ url }) => {
  // eslint-disable-next-line no-console
  console.log(`🚀  Server ready at ${url}`);
});

// await functions.startRun('c5bef54f-0cb7-4331-8c19-d4ef39071682');
// await functions.createRun('96e79178-caef-4c2f-b656-6eb9a7c44c37',
// "{\"dsl\" : \"second sample\"}");
// console.log(await functions.getSimulationRunResults('16b0d320-ae24-4e93-8376-4bf4439952d6',
//   'c5bef54f-0cb7-4331-8c19-d4ef39071682'));
// console.log(await functions.allSimulations());
