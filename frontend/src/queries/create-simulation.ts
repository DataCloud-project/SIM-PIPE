import { gql } from 'graphql-request';

const createSimulationMutation = gql`
  mutation Create_Simulation($name: String, $pipeline_description: String) {
    Create_Simulation(name: $name, pipeline_description: $pipeline_description)
  }
`;

export default createSimulationMutation;
