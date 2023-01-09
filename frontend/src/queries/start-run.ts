import { gql } from 'graphql-request';

const startRunMutation = gql`
  mutation start_run($run_id: String!) {
    Start_Run(run_id: $run_id)
  }
`;

export default startRunMutation;
