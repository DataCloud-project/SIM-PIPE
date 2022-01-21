/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ApolloServer, gql } from 'apollo-server';

import * as functions from './functions.js';
// schema
const typeDefs = gql`
  type Query {
      All_Simulations: String
      # Start: String
  }
  type Mutation {
    Create_Simulation(model_id:String): String
    Create_Run(simulation_id: String, dsl:String): String
    Create_Step(run_id: String, name:String, image:String, pipeline_step_number:Int): String
    # to implement
    Start_Step(step_id:Int): String  
    Start_Run(run_id:String): String  
    Stop_Step(step_id:Int): String
    Stop_Run(run_id:String): String
  }
`;

const resolvers = {
  Query: {
    All_Simulations: functions.allSimulations,
    // stop
  },
  Mutation: {
    async Create_Run(p, arguments_: { simulation_id:string, dsl:string }):Promise<string> {
      return await functions.createRun(arguments_.simulation_id, arguments_.dsl);
    },
    async Create_Step(p, arguments_:{ run_id:string,
      name:string, image:string, pipeline_step_number:number }):Promise<string> {
      return `${await functions.createStep(arguments_.run_id, arguments_.name, arguments_.image, 
        arguments_.pipeline_step_number)}`;
    },
    async Create_Simulation(p, arguments_: { model_id:string }):Promise<string> {
      return await functions.createSimulation(arguments_.model_id);
    },
    async Start_Step(p, arguments_:{ step_id:number }):Promise<string> {
      // TODO
      // await controller.start();
      // queue to follow
      return await functions.startStep(arguments_.step_id);
    },
    async Start_Run(p, arguments_:{ run_id:string }):Promise<string> {
      // TODO
      // queue to follow
      void functions.startRun(arguments_.run_id);
      return arguments_.run_id;
    },
    Stop_Step():string {
      // TODO
      return 'stop the step';
    },
    Stop_Run():string {
      // TODO
      return 'stop all steps in the run';
    },
  },
};

// function parseDSL: assume jsno structure; return all details to start a step

const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// await functions.startRun('c5bef54f-0cb7-4331-8c19-d4ef39071682');
// console.log(await functions.createRun('96e79178-caef-4c2f-b656-6eb9a7c44c37', "{\"dsl\" : \"sample\"}"));
