import { gql } from 'graphql-request';

const allCredentialsQuery = gql`
  query dockerRegistryCredentials {
    dockerRegistryCredentials
  }
`;

export default allCredentialsQuery;