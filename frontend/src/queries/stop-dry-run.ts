import { gql } from 'graphql-request';

const stopDryRunMutation = gql`
	mutation stopDryRun($dryRunId: String!, $terminate: Boolean) {
		stopDryRun(dryRunId: $dryRunId, terminate: $terminate) {
			id
			status {
				phase
			}
		}
	}
`;

export default stopDryRunMutation;
