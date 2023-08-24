import { gql } from 'graphql-request';

const deleteCredentialMutation = gql`
    mutation DeleteDryRun($name: String!) {
        deleteWorkflowTemplate(name: $name)
    }
`;

export default deleteCredentialMutation;
