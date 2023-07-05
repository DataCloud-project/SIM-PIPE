import { gql } from 'graphql-request';

const allProjectsQuery = gql`
  query projects {
    projects {
      name
      id
      createdAt
    }
  }
`;

export default allProjectsQuery;