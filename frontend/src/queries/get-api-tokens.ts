import { gql } from 'graphql-request';

const getApiTokensQuery = gql`
	query apiTokens {
		apiTokens {
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

export default getApiTokensQuery;
