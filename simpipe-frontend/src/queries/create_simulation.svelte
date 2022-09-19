<script context="module">
    
    import { gql } from 'graphql-request'

    export const create_simulation_mutation = gql`
        mutation Create_Simulation($name: String, $pipeline_description: String) {
            Create_Simulation(name: $name, pipeline_description: $pipeline_description)
        }   
        `

</script>
