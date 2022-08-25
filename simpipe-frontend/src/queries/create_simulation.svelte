<script context="module">
    
    import { gql } from 'graphql-request'

    export const create_simulation_mutation = gql`
        mutation Create_Simulation($model_id: String, $name: String, $pipeline_description: String, $userid: String) {
            Create_Simulation(model_id: $model_id, name: $name, pipeline_description: $pipeline_description, userid: $userid)
        }   
        `

</script>
