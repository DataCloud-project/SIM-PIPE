import { gql } from 'graphql-request';

const updateApiTokensMutation = gql`
	mutation updateApiTokens(
		$mooseApiKey: String
		$openrouterApiKey: String
		$inlumenLlmApiKey: String
	) {
		updateApiTokens(
			mooseApiKey: $mooseApiKey
			openrouterApiKey: $openrouterApiKey
			inlumenLlmApiKey: $inlumenLlmApiKey
		) {
			mooseApiKey {
				hasValue
				maskedPreview
				value
			}
			openrouterApiKey {
				hasValue
				maskedPreview
				value
			}
			inlumenLlmApiKey {
				hasValue
				maskedPreview
				value
			}
		}
	}
`;

export default updateApiTokensMutation;
