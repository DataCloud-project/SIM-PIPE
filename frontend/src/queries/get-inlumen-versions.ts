import { gql } from 'graphql-request';

const inlumenVersionsQuery = gql`
	query inlumenVersions {
		inlumenVersions
	}
`;

export default inlumenVersionsQuery;
