import { gql } from 'graphql-request';

const getScalingLawsFromNodesMetricsQuery = gql`
    query ComputeScalingLawsFromNodesMetrics($dryRunIds: [String], $dataX: [Float], $regressionMethod: String) {
        computeScalingLawsFromNodesMetrics(dryRunIds: $dryRunIds, data_x: $dataX, regressionMethod: $regressionMethod)  {
            nodeName
            cpu {
                coeffs
                type
                r2
            }
            mem {
                coeffs
                type
                r2
            }
            duration {
                coeffs
                type
                r2
            }
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

export default getScalingLawsFromNodesMetricsQuery;
