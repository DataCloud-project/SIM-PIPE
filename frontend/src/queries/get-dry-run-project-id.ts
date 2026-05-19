import { gql } from 'graphql-request';

const getDryRunProjectIDQuery = gql`
	query getDryRunAllMetrics($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			project {
				id
			}
		}
	}
`;

export default getDryRunProjectIDQuery;
