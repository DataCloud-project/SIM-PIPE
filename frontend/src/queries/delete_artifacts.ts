import { gql } from 'graphql-request';

const deleteArtifactsMutation = gql`
	mutation DeleteArtifacts($bucketName: String!, $keys: [String!]!) {
		deleteArtifacts(bucketName: $bucketName, keys: $keys)
	}
`;

export default deleteArtifactsMutation;
