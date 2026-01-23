import { gql } from 'graphql-request';

const getMooseAnalysisQuery = gql`
	query getMooseAnalysis($artifactUrl: String!) {
		result: getMooseAnalysis(artifactUrl: $artifactUrl)
	}
`;

export default getMooseAnalysisQuery;
