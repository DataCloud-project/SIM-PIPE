import { gql } from 'graphql-request';

const getProjectQuery = gql`
	query project($projectId: String!) {
		project(projectId: $projectId) {
			workflowTemplates {
				argoWorkflowTemplate
			}
		}
	}
`;

export default getProjectQuery;
