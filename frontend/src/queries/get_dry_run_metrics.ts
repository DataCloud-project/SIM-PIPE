import { gql } from 'graphql-request';

const getDryRunMetricsQuery = gql`
	query getDryRunMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			status {
				phase
				message
			}
			nodes {
				duration
				phase
				type
				... on DryRunNodePod {
					id
					displayName
					startedAt
					finishedAt
					type
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
