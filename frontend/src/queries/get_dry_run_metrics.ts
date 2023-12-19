import { gql } from 'graphql-request';

const getDryRunMetricsQuery = gql`
	query getDryRunMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				duration
        		phase
				type
				... on DryRunNodePod {
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
