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
					message
				}
				nodes {
					startedAt
					finishedAt
					duration
					type
					... on DryRunNodePod {
						displayName
						type
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
