import { gql } from 'graphql-request';

const setMooseReportMutation = gql`
	mutation setMooseReport($bucketName: String, $key: String!, $report: String!) {
		setMooseReport(bucketName: $bucketName, key: $key, report: $report)
	}
`;

export default setMooseReportMutation;
