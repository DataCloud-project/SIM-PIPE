import { gql } from 'graphql-request';

const getSimulationQuery = gql`
  query getSimulation($simulation_id: String) {
    Get_Simulation(simulation_id: $simulation_id)
    # TODO change back.
    #    changed output type of query to string {
    #         simulations {
    #             simulation_id
    #             name
    #             created
    #             runs {
    #                 run_id
    #                 name
    #                 status
    #                 created
    #                 steps {
    #                     step_id
    #                     status
    #                     created
    #                     started
    #                     ended
    #                     name
    #                     pipeline_step_number
    #                     resource_usages {
    #                     id
    #                     step_id
    #                     cpu
    #                     memory
    #                     memory_max
    #                     rx_value
    #                     time
    #                     tx_value
    #                     }
    #             }
    #         }
    #     }
  }
`;

export default getSimulationQuery;
