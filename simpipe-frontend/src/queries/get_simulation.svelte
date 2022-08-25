<script context="module">
    
    import { gql } from 'graphql-request'

    export const get_simulation_query = gql`
        query getSimulation($userid: String, $simulation_id:String) {
            Get_Simulation(userid: $userid, simulation_id:$simulation_id) 
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
        `

</script>
