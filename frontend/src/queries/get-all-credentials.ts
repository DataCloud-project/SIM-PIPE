import { gql } from 'graphql-request';

const allCredentialsQuery = gql`
	query dockerRegistryCredentials {
		dockerRegistryCredentials {
			name
			server
			username
		}
	}
`;

export default allCredentialsQuery;
