import RunsStream from './runs-stream.js';
import type Queue from '../utils/queue.js';
import type { RunInStream } from './runs-stream.js';

let runsStreamQueueSingleton: Queue<RunInStream> | undefined;

function getQueue(): Queue<RunInStream> {
  if (!runsStreamQueueSingleton) {
    const runsStream = new RunsStream();
    runsStream.on('error', (error) => {
      throw new Error(`Error in runs stream\n${error as string}`);
    });
    runsStreamQueueSingleton = runsStream.asQueue();
  }

  return runsStreamQueueSingleton;
}

export default async function loadNextRun(): Promise<RunInStream> {
  const a = await getQueue().dequeue();
  console.log(a);
  return a;
}
