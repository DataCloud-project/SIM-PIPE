import { gql } from 'graphql-request';

const deleteBucketMutation = gql`
	mutation deleteBucket($bucketName: String!) {
		deleteBucket(name: $bucketName)
	}
`;

export default deleteBucketMutation;
