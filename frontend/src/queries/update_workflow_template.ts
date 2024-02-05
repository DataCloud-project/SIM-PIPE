import { gql } from 'graphql-request';

const updateWorkflowTemplateMutation = gql`
	mutation UpdateWorkflowTemplate($update: UpdateWorkflowTemplateInput!) {
		updateWorkflowTemplate(update: $update) {
			argoWorkflowTemplate
			name
			project {
				id
			}
		}
	}
`;

export default updateWorkflowTemplateMutation;
