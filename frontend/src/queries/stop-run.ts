import { gql } from 'graphql-request';

const stopRunMutation = gql`
  mutation stop_run($run_id: String!) {
    Stop_Run(run_id: $run_id)
  }
`;

export default stopRunMutation;
