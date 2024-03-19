import { gql } from 'graphql-request';

const allBucketsQuery = gql`
    query Buckets {
        buckets {
            name
        }
    }
`;

export default allBucketsQuery;
