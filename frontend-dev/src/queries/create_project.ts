import { gql } from 'graphql-request';

const createProjectMutation = gql`
  mutation createProject($project: CreateProjectInput) {
    createProject(project: $project)
  }
`;

export default createProjectMutation;