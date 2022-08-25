<script context="module">
    
    import { gql } from 'graphql-request'

    export const start_run_mutation = gql`
        mutation start_run($run_id: String!, $userid: String!) {
            Start_Run(run_id: $run_id, userid: $userid)
        }   
        `

</script>
