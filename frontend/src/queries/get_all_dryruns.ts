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
					progress
					startedAt
					estimatedDuration
					finishedAt
					message
					phase
				}
			}
		}
	}
`;

export default allDryRunsQuery;
