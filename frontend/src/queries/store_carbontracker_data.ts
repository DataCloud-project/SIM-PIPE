import { gql } from 'graphql-request';

const storeCarbontrackerDataMutation = gql`
	mutation StoreCarbontrackerData($dryRunId: String!, $data: [StoreCarbontrackerNodeInput!]!) {
		storeCarbontrackerData(dryRunId: $dryRunId, data: $data)
	}
`;

export default storeCarbontrackerDataMutation;
