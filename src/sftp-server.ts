// start a dockerized sftp server in sandbox using atmoz/sftp
// using dockerode-compose library

import Docker from 'dockerode';

import DockerodeCompose from './compose.js';

// var docker = new Docker();
const docker = new Docker({
  host: '127.0.0.1',
  port: 2375,
});
const compose = new DockerodeCompose(docker, './sftp_atmoz.yml', 'stfp');

//  start sftp server in host 2 using atmoz docker image
(async () => {
  await compose.pull();
  const state = await compose.up();
  console.log(state);
})();
