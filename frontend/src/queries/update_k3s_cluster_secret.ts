import { gql } from 'graphql-request';

const updateK3sClusterSecretMutation = gql`
	mutation updateK3sClusterSecret($token: String, $serverIp: String) {
		updateK3sClusterSecret(token: $token, serverIp: $serverIp) {
			token
			serverIp
		}
	}
`;

export default updateK3sClusterSecretMutation;
