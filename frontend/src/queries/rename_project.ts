import { gql } from 'graphql-request';

const renameProjectMutation = gql`
  mutation renameProject($projectId: String, $name: String) {
    renameProject(projectId: $projectId, name: $name)
  }
`;

export default renameProjectMutation;