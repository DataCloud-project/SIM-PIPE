import { GraphQLClient } from 'graphql-request';

import { hasuraAdminSecret, hasuraEndpoint } from '../config.js';
import { getSdk } from './database.js';

if (!hasuraAdminSecret) {
  throw new Error('Hasura admin password not set');
}
const client = new GraphQLClient(hasuraEndpoint, {
  headers: {
    'x-hasura-admin-secret': hasuraAdminSecret,
    // If this header is not set, Hasura will close the TCP connection,
    // while the node fetch will expect the connection to be kept alive.
    // Fun.
    Connection: 'keep-alive',
  },
});
const sdk = getSdk(client);

export default sdk;
