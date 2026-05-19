import { gql } from 'graphql-request';

const allProjectsQuery = gql`
	query projects {
		projects {
			name
			id
			createdAt
			dryRuns {
				id
			}
			workflowTemplates {
				argoWorkflowTemplate
			}
		}
	}
`;

export default allProjectsQuery;
