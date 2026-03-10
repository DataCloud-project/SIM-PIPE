import { gql } from 'graphql-request';

const updateApiTokensMutation = gql`
	mutation updateApiTokens($mooseApiKey: String, $openrouterApiKey: String) {
		updateApiTokens(mooseApiKey: $mooseApiKey, openrouterApiKey: $openrouterApiKey) {
			mooseApiKey {
				hasValue
				maskedPreview
			}
			openrouterApiKey {
				hasValue
				maskedPreview
			}
		}
	}
`;

export default updateApiTokensMutation;
