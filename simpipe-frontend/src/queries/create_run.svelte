<script context="module">
    
    import { gql } from 'graphql-request'

    export const create_run_mutation = gql`
        mutation create_run_withinput($dsl: String, $name: String, $sampleInput: [[String]], $simulation_id: String, $userid: String, 
            $env_list:[[String]], $timeout_value:Int) {
            Create_Run_WithInput(dsl: $dsl, name: $name, sampleInput: $sampleInput, simulation_id: $simulation_id, userid: $userid,
            env_list: $env_list, timeout_value: $timeout_value)
        }   
        `

</script>
