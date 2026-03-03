import { gql } from 'graphql-request';

const getK3sClusterSecretQuery = gql`
	query k3sClusterSecret {
		k3sClusterSecret {
			token
			serverIp
		}
	}
`;

export default getK3sClusterSecretQuery;
