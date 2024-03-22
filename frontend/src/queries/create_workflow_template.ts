import { gql } from 'graphql-request';

const createWorkflowTemplateMutation = gql`
	mutation Mutation($input: CreateWorkflowTemplateInput!) {
		createWorkflowTemplate(input: $input) {
			name
		}
	}
`;

export default createWorkflowTemplateMutation;
