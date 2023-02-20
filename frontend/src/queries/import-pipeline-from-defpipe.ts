import { gql } from 'graphql-request';

const importPipelineFromDefpipeQuery = gql`
  query ImportPipelineFromDEFPIPE($name: String) {
    ImportPipelineFromDEFPIPE(name: $name)
  }
`;

export default importPipelineFromDefpipeQuery;
