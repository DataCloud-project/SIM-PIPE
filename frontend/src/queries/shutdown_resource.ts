import { gql } from 'graphql-request';

const shutdownResourceMutation = gql`
	mutation shutdownResource($resourceId: String!) {
		shutdownResource(resourceId: $resourceId)
	}
`;

export default shutdownResourceMutation;
