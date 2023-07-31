import { gql } from 'graphql-request';

const getDryRunPhaseResultsQuery = gql`
    query Nodes($dryRunId: String!) {
        dryRun(dryRunId: $dryRunId) {
            nodes {
                displayName
                phase
            }
        }
    }
`;

export default getDryRunPhaseResultsQuery;