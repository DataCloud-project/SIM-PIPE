import { gql } from 'graphql-request';

const allArtifactsQuery = gql`
	query Artifacts($bucketName: String) {
		artifacts(bucketName: $bucketName) {
			name
			key
			url
			bucketName
			mooseReport
		}
	}
`;

export default allArtifactsQuery;
