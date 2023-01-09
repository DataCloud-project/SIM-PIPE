import { gql } from 'graphql-request';

const deleteRunMutation = gql`
  mutation delete_run($run_id: String!) {
    Delete_Run(run_id: $run_id)
  }
`;

export default deleteRunMutation;
