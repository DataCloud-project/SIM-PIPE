import { gql } from 'graphql-request';

const stopDryRunMutation = gql`
  mutation stopDryRun($dryRunId: String, terminate:boolean) {
    stopDryRun(dryRunId: $dryRunId)
  }
`;

export default stopDryRunMutation;