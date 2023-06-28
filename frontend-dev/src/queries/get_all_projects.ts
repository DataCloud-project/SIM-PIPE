import { gql } from 'graphql-request';

const allProjectsQuery = gql`
  query projects {
    projects
  }
`;

export default allProjectsQuery;