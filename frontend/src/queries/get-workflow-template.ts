import { gql } from 'graphql-request';

const getWorkflowQuery = gql`
	query WorkflowTemplate($name: String!) {
		workflowTemplate(name: $name) {
			argoWorkflowTemplate
		}
	}
`;

export default getWorkflowQuery;
