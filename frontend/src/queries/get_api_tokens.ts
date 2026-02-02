import { gql } from 'graphql-request';

const getApiTokensQuery = gql`
	query apiTokens {
		apiTokens {
			mooseApiKey
			openrouterApiKey
			openrouterApiKeyPaid
		}
	}
`;

export default getApiTokensQuery;
