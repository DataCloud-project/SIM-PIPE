import { gql } from 'graphql-request';

const getWorkflowFromDryRunQuery = gql`
    query WorkflowTemplateFromDryRun($dryRunId: String!) {
        dryRun(dryRunId: $dryRunId) {
            id
            project {name, id}
            argoWorkflow
        }
    }
`;

export default getWorkflowFromDryRunQuery;
