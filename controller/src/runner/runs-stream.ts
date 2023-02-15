import { createClient } from 'graphql-ws';
import { randomUUID } from 'node:crypto';
import { EventEmitter } from 'node:events';
import ws from 'ws';
import type { Client } from 'graphql-ws';

import { hasuraAdminSecret, hasuraWsEndpoint } from '../config.js';
import Queue from '../utils/queue.js';

export interface RunInStream {
  runId: string;
}

export default class RunsStream extends EventEmitter {
  client: Client;

  constructor() {
    super();
    this.client = createClient({
      url: hasuraWsEndpoint,
      webSocketImpl: ws,
      generateID: () => randomUUID(),
      connectionParams: {
        headers: {
          'x-hasura-admin-secret': hasuraAdminSecret,
        },
      },
    });

    this.client.subscribe({
      query: `subscription MyQuery {
    runsStream(batchSize: 10, cursor: {initialValue: {created: "1970-01-01T00:00:00.000Z"}, ordering: ASC}, where: {status: {_eq: WAITING}}) {
      runId
    }
  }`,
    }, {
      next: (data) => {
        const runs = data.data?.runsStream;
        if (Array.isArray(runs)) {
          for (const run of runs) {
            this.emit('data', run);
          }
        } else {
          this.emit('error', new Error('Unexpected data'));
        }
      },
      error: (error) => this.emit('error', error),
      // eslint-disable-next-line unicorn/no-null
      complete: () => this.emit('data', null),
    });
  }

  asQueue(): Queue<RunInStream> {
    const queue = new Queue<RunInStream>();
    this.on('data', (run) => queue.enqueue(run as RunInStream));
    return queue;
  }
}
