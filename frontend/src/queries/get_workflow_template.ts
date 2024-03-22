import { gql } from 'graphql-request';

const getWorkflowQuery = gql`
	query WorkflowTemplate($name: String!) {
		workflowTemplate(name: $name) {
			name
			project {
				name
				id
			}
			argoWorkflowTemplate
		}
	}
`;

export default getWorkflowQuery;
