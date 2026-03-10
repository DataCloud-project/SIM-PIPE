import { gql } from 'graphql-request';

const cleanupResourceMutation = gql`
	mutation cleanupStaleResource($resourceId: String!) {
		cleanupStaleResource(resourceId: $resourceId)
	}
`;

export default cleanupResourceMutation;
