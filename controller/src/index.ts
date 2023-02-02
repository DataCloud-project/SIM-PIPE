import logger from './logger.js';
import { pingRunner } from './runner/runner-utils.js';
import { setupBucket as setupStorageBucket } from './server/minio.js';
import startServer from './server/server.js';

// Ping docker deamon to check whether it is running
try {
  await pingRunner();
  logger.info('🐳 Docker daemon is running');
} catch (error) {
  logger.error('🐳 Docker daemon is not running');
  throw new Error(`🎌 Error pinging docker daemon\n${error as string}`);
}

await startServer();

await setupStorageBucket();
