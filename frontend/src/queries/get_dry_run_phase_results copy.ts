import { gql } from 'graphql-request';

const getDryRunInputFilesizeQuery = gql`
	query getDryRunInputFilesizeQuery($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			argoWorkflow
		}
	}
`;

export default getDryRunInputFilesizeQuery;
