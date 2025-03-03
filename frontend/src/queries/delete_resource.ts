import { gql } from 'graphql-request';

const deleteResourceMutation = gql`
	mutation deleteResource($resourceId: String!) {
		deleteResource(resourceId: $resourceId)
	}
`;

export default deleteResourceMutation;
