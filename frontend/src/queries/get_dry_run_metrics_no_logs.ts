import { gql } from 'graphql-request';

const getDryRunNoLogsMetricsQuery = gql`
	query getDryRunMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				duration
        		phase
				type
				... on DryRunNodePod {
					displayName
					startedAt
					duration
					finishedAt
					type
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
