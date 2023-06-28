import { gql } from 'graphql-request';

const createDryRunMutation = gql`
  mutation createDryRun($argoWorkflow: ArgoWorkflow, $projectId: String, $dryRunId: String) {
    createDryRun(argoWorkflow: $argoWorkflow, projectId: $projectId, dryRunId: $dryRunId)
  }
`;

export default createDryRunMutation;