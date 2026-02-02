import { gql } from 'graphql-request';

const getApiTokensQuery = gql`
	query apiTokens {
		apiTokens {
			mooseApiKey
			openrouterApiKey
		}
	}
`;

export default getApiTokensQuery;
