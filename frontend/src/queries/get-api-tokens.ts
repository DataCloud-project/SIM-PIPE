import { gql } from 'graphql-request';

const getApiTokensQuery = gql`
	query apiTokens {
		apiTokens {
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

export default getApiTokensQuery;
