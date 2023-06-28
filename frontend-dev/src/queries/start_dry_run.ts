import { gql } from 'graphql-request';

// TODO: since argo automatically starts dry runs upon creation,
// this can only be used if dry run is created in the paused mode.
const resumeDryRunMutation = gql`
  mutation resumeDryRun($dryRunId: String) {
    resumeDryRun(dryRunId: $dryRunId)
  }
`;

export default resumeDryRunMutation;