import { gql } from 'graphql-request';

const allDryRunsQuery = gql`
	query ($projectId: String!) {
		project(projectId: $projectId) {
			name
			id
			workflowTemplates {
				argoWorkflowTemplate
			}
			dryRuns {
				id
				createdAt
				status {
					phase
				}
				nodes {
					startedAt
					finishedAt
					... on DryRunNodePod {
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
	}
`;

export default allDryRunsQuery;
