import { ApolloServer, gql } from 'apollo-server';

import * as controller from '../controller.js';

// schema

const typeDefs = gql`
  type Query {
      Simulations: [Simulation]
      Runs: [Run]
      Start: String
  }

  type Simulation {
      model_id: String,
      sim_id: String,
      run_id: String,
  }  

  type Run {
      run_id: String, 
      step_number: String
      image: String
      resource_usage_list: [ResourceUsageInstance]
  }

  type ResourceUsageInstance {
    timestamp: String,
    cpu: Int,
    memory: Int,
    memory_max: Int,
    net: Int, 
  }
`;
// placeholder for database
const simulations = [
  {
    sim_id: 'sim01',
    run_id: '1',
  },
];

// placeholder for database
const runs = [
  {
    run_id: '1',
    step_number: '1',
    image: 'i1',
    resource_usage_list: [
      {
        timestamp: '2021-12-16T14:28:33.617522158Z',
        cpu: 73_440_490,
        memory: 700_416,
        memory_max: 3_645_440,
        net: 526,
      }],
  },
];

async function startSimulation():Promise<string> {
  // start simulation
  await controller.start();
  return 'Simulation started';
}

const resolvers = {
  Query: {
    Simulations: () => simulations,
    Runs: () => runs,
    Start: startSimulation,
    // Stop
  },
};


const server = new ApolloServer({ typeDefs, resolvers });
await server.listen({ port: 9000 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
