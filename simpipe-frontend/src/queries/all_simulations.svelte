<script context="module">
    
    import { gql } from 'graphql-request'

    export const all_simulations_query = gql`
        query all_simulations($userid: String) {
            All_Simulations(userid: $userid){
            simulations {
                simulation_id
                name
                
            }
        }
        }
        `

</script>
