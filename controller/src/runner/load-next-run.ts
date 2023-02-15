import logger from '../logger.js';
import RunsStream from './runs-stream.js';
import type Queue from '../utils/queue.js';
import type { RunInStream } from './runs-stream.js';

let runsStreamSingleton: RunsStream | undefined;
let runsStreamQueueSingleton: Queue<RunInStream> | undefined;

function getQueue(): Queue<RunInStream> {
  if (!runsStreamSingleton
    || !runsStreamQueueSingleton
    || runsStreamSingleton.hasEncounteredError) {
    runsStreamSingleton = new RunsStream();
    runsStreamSingleton.on('error', (error: Error) => {
      if (runsStreamQueueSingleton) {
        runsStreamQueueSingleton.rejectAllWaiting(error);
      }
      runsStreamSingleton = undefined;
      runsStreamQueueSingleton = undefined;
      logger.error(`Error in runs stream: ${error.message}`);
    });
    runsStreamQueueSingleton = runsStreamSingleton.asQueue();
  }

  return runsStreamQueueSingleton;
}

export default async function loadNextRun(): Promise<RunInStream> {
  return await getQueue().dequeue();
}
