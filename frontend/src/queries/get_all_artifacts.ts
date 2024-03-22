import { gql } from 'graphql-request';

const allArtifactsQuery = gql`
	query Artifacts($bucketName: String) {
		artifacts(bucketName: $bucketName) {
			name
			url
			size
			bucketName
		}
	}
`;

export default allArtifactsQuery;
