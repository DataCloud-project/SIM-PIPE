<script context="module">
    
    import { gql } from 'graphql-request'

    export const all_simulations_query = gql`
        query all_simulations {
            All_Simulations{
            simulations {
                simulation_id
                name
                
            }
        }
        }
        `

</script>
