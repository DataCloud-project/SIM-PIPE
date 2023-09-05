import { gql } from 'graphql-request';

const updateCredentialMutation = gql`
    mutation UpdateWorkflowTemplate($update: UpdateWorkflowTemplateInput!) {
        updateWorkflowTemplate(update: $update) {
            argoWorkflowTemplate
            name
        }
    }
`;

export default updateCredentialMutation;
