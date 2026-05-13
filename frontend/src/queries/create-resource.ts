import { gql } from 'graphql-request';

const createResourceMutation = gql`
	mutation createResource($input: CreateResourceInput!) {
		createResource(input: $input) {
			name
		}
	}
`;

export default createResourceMutation;
