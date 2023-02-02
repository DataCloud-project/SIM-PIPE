import Docker from 'dockerode';
import fsAsync from 'node:fs/promises';

import {
  dockerCaCertPath, dockerHost, dockerPort,
  dockerProtocol, dockerSocketPath, dockerTlsCertPath, dockerTlsKeyPath, remote,
} from '../config.js';

let docker: Docker;

if (remote) {
  const caCert = dockerCaCertPath ? await fsAsync.readFile(dockerCaCertPath) : undefined;
  const tlsCert = dockerTlsCertPath ? await fsAsync.readFile(dockerTlsCertPath) : undefined;
  const tlsKey = dockerTlsKeyPath ? await fsAsync.readFile(dockerTlsKeyPath) : undefined;

  // remote connection to docker daemon
  docker = new Docker({
    host: dockerHost,
    port: dockerPort,
    protocol: dockerProtocol,
    ca: caCert,
    cert: tlsCert,
    key: tlsKey,
  });
} else {
  // local connection to docker dameon
  const stats = await fsAsync.stat(dockerSocketPath);

  if (!stats.isSocket()) {
    throw new Error('🎌 Are you sure the docker is running?');
  }

  docker = new Docker({ socketPath: dockerSocketPath });
}

const defaultExport = docker;
export default defaultExport;
