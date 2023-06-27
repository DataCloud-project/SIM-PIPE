import { gql } from 'graphql-request';

const deleteProjectMutation = gql`
  mutation deleteProject($projectId: String) {
    deleteProject(projectId: $projectId)
  }
`;

export default deleteProjectMutation;