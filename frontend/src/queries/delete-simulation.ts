import { gql } from 'graphql-request';

const deleteSimulationMutation = gql`
  mutation delete_simulation($simulation_id: String!) {
    Delete_Simulation(simulation_id: $simulation_id)
  }
`;

export default deleteSimulationMutation;
