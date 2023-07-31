import { gql } from 'graphql-request';

const createDryRunMutation = gql`
  mutation createDryRun($input: CreateDryRunInput!) {
    createDryRun(input: $input) {
      id
    }
  }
`;

export default createDryRunMutation;