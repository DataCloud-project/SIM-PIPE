import { gql } from 'graphql-request';

const getDryRunPhaseResultsQuery = gql`
	query Nodes($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			nodes {
				displayName
				phase
				type
				... on DryRunNodePod {
					id
					displayName
					startedAt
					finishedAt
					duration
					phase
					outputArtifacts {
						bucketName
						key
						name
						size
						url
						mooseReport
						sotwReportUrl
					}
					carbontracker {
						co2eq
						energy
					}
				}
			}
		}
	}
`;

export default getDryRunPhaseResultsQuery;
