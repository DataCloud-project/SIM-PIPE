import { gql } from 'graphql-request';

const getMooseAnalysisQuery = gql`
	query getMooseAnalysis($artifactUrl: String!, $save: Boolean) {
		result: getMooseAnalysis(artifactUrl: $artifactUrl, save: $save)
	}
`;

export default getMooseAnalysisQuery;
