import { gql } from 'graphql-request';

const allProjectsQuery = gql`
  query projects {
    projects {
      name
      id
      createdAt
      # TODO: this is used to get dry run count, to be changed when dryRuns_aggregate is included in the api 
      dryRuns {
        id
      }
    }
  }
`;

export default allProjectsQuery;