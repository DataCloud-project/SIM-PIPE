import { gql } from 'graphql-request';

const getDryRunNoLogsMetricsQuery = gql`
query getDryRunMetrics($dryRunId: String!) {
  dryRun(dryRunId: $dryRunId) {
    nodes {
    ... on DryRunNodePod {
        displayName
        startedAt
        duration
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

export default getDryRunNoLogsMetricsQuery;