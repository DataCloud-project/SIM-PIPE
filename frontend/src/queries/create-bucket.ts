import { gql } from 'graphql-request';

const createBucketMutation = gql`
	mutation createBucket($bucketName: String!) {
		createBucket(name: $bucketName)
	}
`;

export default createBucketMutation;
