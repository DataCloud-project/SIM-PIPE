import { gql } from 'graphql-request';

const allResourcesQuery = gql`
	query resources {
		resources {
			name
			os
			cpus
			memory
			status
		}
	}
`;

export default allResourcesQuery;
