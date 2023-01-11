import { gql } from 'graphql-tag';

/**
 * graphql query and resolvers
 */
export default gql`
  scalar UUID

  type Query {
    Username: String @auth
    Ping: String
  }

  type Run {
    run_id: UUID
  }


  type Mutation @auth {
    Create_Run_WithInput(simulation_id: String,name:String, sampleInput:[[String]],
    env_list: [[String]], timeout_values:[Int]):
    Run
    Start_Run(run_id:UUID): Run
    Stop_Run(run_id:UUID): Run
  }
`;
