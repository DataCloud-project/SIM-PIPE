import { gql } from 'graphql-request';

const updateApiTokensMutation = gql`
	mutation updateApiTokens(
		$mooseApiKey: String
		$openrouterApiKey: String
		$openrouterApiKeyPaid: String
	) {
		updateApiTokens(
			mooseApiKey: $mooseApiKey
			openrouterApiKey: $openrouterApiKey
			openrouterApiKeyPaid: $openrouterApiKeyPaid
		) {
			mooseApiKey
			openrouterApiKey
			openrouterApiKeyPaid
		}
	}
`;

export default updateApiTokensMutation;
