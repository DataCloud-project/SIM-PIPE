import { gql } from 'graphql-request';

const getDryRunQuery = gql`
  query DryRun($dryRunId: String!) {
  dryRun(dryRunId: $dryRunId) {
    project {
      name
      id
    }
  }
}
`;

export default getDryRunQuery;