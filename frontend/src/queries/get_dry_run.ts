import { gql } from 'graphql-request';

const getDryRunQuery = gql`
  query dryRun($dryRunId: String) {
    dryRun(dryRunId: $dryRunId)
  }
`;

export default getDryRunQuery;