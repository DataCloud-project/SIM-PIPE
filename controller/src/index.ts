import { interpret } from 'xstate';

import logger from './logger.js';
import runnerStateMachine from './runner/runner-state-machine.js';
import { pingRunner } from './runner/runner-utils.js';
import startSleeper from './runner/start-sleeper.js';
import { setupStorageBucket } from './server/minio.js';
import startServer from './server/server.js';

// Load mode from argv
const mode = process.argv[2];

if (mode === 'server' || mode === 'both') {
  await startServer();
  await setupStorageBucket();
}

if (mode === 'runner' || mode === 'both') {
  // Ping docker deamon to check whether it is running
  try {
    await pingRunner();
    logger.info('🐳 Docker daemon is running');
  } catch (error) {
    logger.error('🐳 Docker daemon is not running');
    throw new Error(`🎌 Error pinging docker daemon\n${error as string}`);
  }

  // Start the background sleeping container.
  // It's purpose is to do further checks on the docker daemon
  // and to initialise Promscale and TimescaleDB with the right metrics labels.
  await startSleeper();

  // Start the runner state machine
  const runner = interpret(runnerStateMachine);
  runner.onTransition((state) => {
    logger.info(`⚙️ Runner State Transition: ${JSON.stringify(state.value)}`);
  });
  runner.start();
}

if (mode !== 'server' && mode !== 'runner' && mode !== 'both') {
  throw new Error(`Unknown mode "${mode}"`);
}
