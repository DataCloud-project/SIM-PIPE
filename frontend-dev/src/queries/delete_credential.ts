import { gql } from 'graphql-request';

const deleteCredentialMutation = gql`
  mutation deleteDockerRegistryCredential($name: String) {
    deleteDockerRegistryCredential(name: $name)
  }
`;

export default deleteCredentialMutation;