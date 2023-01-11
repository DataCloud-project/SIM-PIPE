import startServer from './server/server.js';

// TODO: global variables, but through the environment variables
// This may need to be changed
process.env.IS_SIMULATION_RUNNING = 'false';
process.env.CANCEL_RUN_LIST = '';

await startServer();
