import { gql } from 'graphql-request';

const getDryRunNoLogsMetricsQuery = gql`
	query getDryRunAllMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				duration
				type
				... on DryRunNodePod {
					displayName
					startedAt
					finishedAt
					duration
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
						cpuSystemSecondsTotal {
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
