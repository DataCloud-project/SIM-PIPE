<script context="module">
    
    import { gql } from 'graphql-request'

    export const delete_run_mutation = gql`
        mutation delete_run($run_id: String!) {
            Delete_Run(run_id: $run_id)
        }   
        `

</script>
