import { gql } from 'graphql-request';

const createCredentialMutation = gql`
  mutation createDockerRegistryCredential($credential: DockerRegistryCredentialInput) {
    createDockerRegistryCredential(credential: $credential) {
      name
      server
      username
      }
  }
`;

export default createCredentialMutation;