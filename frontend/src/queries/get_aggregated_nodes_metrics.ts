import { gql } from 'graphql-request';

const getAggregatedNodesMetricsQuery = gql`
    mutation GetAggregatedNodesMetrics($dryRunIds: [String]!) {
        getAggregatedNodesMetrics(dryRunIds: $dryRunIds) {
        nodeName
        data {
            cpu
            mem
            duration
            fileSize
            nodeId
            }
        }
    }
`;

export default getAggregatedNodesMetricsQuery;
