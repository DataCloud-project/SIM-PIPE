import { setTimeout } from 'node:timers/promises';

import getDocker from './docker.js';

// Ping docker deamon to check if it is running
export default async function pingRunner(): Promise<void> {
  const docker = await getDocker();
  const pingResult = await Promise.race<string | unknown>([
    setTimeout(5000, 'timeout'),
    docker.ping(),
  ]);
  if (pingResult === 'timeout') {
    throw new Error('ping timeout');
  }
}
