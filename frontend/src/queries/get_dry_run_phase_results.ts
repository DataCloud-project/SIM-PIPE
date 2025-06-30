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
						key
						name
						url
					}
				}
			}
		}
	}
`;

export default getDryRunPhaseResultsQuery;
