import { gql } from 'graphql-request';

// TODO fix the GraphQL server to stop returning a JSON string
const allSimulationsQuery = gql`
  query all_simulations {
    All_Simulations
  }
`;

export default allSimulationsQuery;
