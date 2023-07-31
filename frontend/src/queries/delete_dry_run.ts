import { gql } from 'graphql-request';

const deleteDryRunMutation = gql`
  mutation deleteDryRun($dryRunId: String!) {
    deleteDryRun(dryRunId: $dryRunId)
  }
`;

export default deleteDryRunMutation;