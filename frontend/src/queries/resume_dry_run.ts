import { gql } from 'graphql-request';

const resumeDryRunMutation = gql`
  mutation resumeDryRun($dryRunId: String!) {
    resumeDryRun(dryRunId: $dryRunId) {
      id
      status {
        phase
      }
    }
  }
`;

export default resumeDryRunMutation;