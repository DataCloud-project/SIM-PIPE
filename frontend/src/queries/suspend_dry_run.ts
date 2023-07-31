import { gql } from 'graphql-request';

const suspendDryRunMutation = gql`
	mutation suspendDryRun($dryRunId: String!) {
		suspendDryRun(dryRunId: $dryRunId) {
			id
			status {
				phase
			}
		}
	}
`;

export default suspendDryRunMutation;
