import { gql } from 'graphql-request';

const updateCredentialMutation = gql`
	mutation updateDockerRegistryCredential($credential: DockerRegistryCredentialInput) {
		updateDockerRegistryCredential(credential: $credential)
	}
`;

export default updateCredentialMutation;
