import { gql } from 'graphql-request';

const allDryRunssQuery = gql`
  query($projectId: String!)  {
    project(projectId: $projectId) {
    dryRuns {
        id
        createdAt
        status {
          progress
          startedAt
          estimatedDuration
          finishedAt
          message
          phase
        }
      }
    }
  }
`;

export default allDryRunssQuery;