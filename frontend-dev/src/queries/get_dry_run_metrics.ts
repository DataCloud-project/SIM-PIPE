import { gql } from 'graphql-request';

const getDryRunMetricsQuery = gql`
query getDryRunMetrics($dryRunId: String!) {
  dryRun(dryRunId: $dryRunId) {
    nodes {
    ... on DryRunNodePod {
        displayName
        startedAt
        duration
        log
        metrics {
          cpuUsageSecondsTotal {
            timestamp
            value
          }
          memoryUsageBytes {
            timestamp
            value
          }
          networkReceiveBytesTotal {
            timestamp
            value
          }
          networkTransmitBytesTotal {
            timestamp
            value
          }
        }
      }
    }
  }
}
`;

export default getDryRunMetricsQuery;