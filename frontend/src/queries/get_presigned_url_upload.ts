import { gql } from 'graphql-request';

const getUploadPresignedUrl = gql`
	mutation ComputeUploadPresignedUrl($key: String, $bucketName: String) {
        computeUploadPresignedUrl(key: $key, bucketName: $bucketName)
  }
`;

export default getUploadPresignedUrl;
