import { gql } from 'graphql-request';

const inlumenPipelinesQuery = gql`
	query inlumenPipelines {
		inlumenPipelines
	}
`;

export default inlumenPipelinesQuery;
