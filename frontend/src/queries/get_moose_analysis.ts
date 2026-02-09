import { gql } from 'graphql-request';

const getMooseAnalysisQuery = gql`
	query getMooseAnalysis($artifactUrl: String!, $stepStartedAt: String, $save: Boolean) {
		result: getMooseAnalysis(
			artifactUrl: $artifactUrl
			stepStartedAt: $stepStartedAt
			save: $save
		)
	}
`;

export default getMooseAnalysisQuery;
