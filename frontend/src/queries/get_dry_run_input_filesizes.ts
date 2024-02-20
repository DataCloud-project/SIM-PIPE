import { gql } from 'graphql-request';

const getDryRunInputFilesizeQuery = gql`
	query getDryRunInputFilesizeQuery($dryRunId: String!) {
		dryRun(dryRunId: $dryRunId) {
			argoWorkflow
			project {
				id
			}
			nodes {
				... on DryRunNodePod {
					inputArtifacts {
						name
						size
					}
				}
			}
		}
	}
`;

export default getDryRunInputFilesizeQuery;
