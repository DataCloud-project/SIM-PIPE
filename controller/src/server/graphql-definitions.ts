import { gql } from 'apollo-server';

/**
 * graphql query and resolvers
 */
export default gql`
  scalar JSON
  # The queries are only available through Hasura
  type Query { Username: String }
  type Mutation {
    Create_Simulation(name:String, pipeline_description:String): String
    Create_Run_WithInput(simulation_id: String,name:String, sampleInput:[[String]],
    env_list: [[String]], timeout_values:[Int]):
    String
    Start_Run(run_id:String): String
    Stop_Run(run_id:String): String
    Delete_Run(run_id:String): String
    Delete_Simulation(simulation_id:String): String
  }
`;
