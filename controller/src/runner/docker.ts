import Docker from 'dockerode';
import fsAsync from 'node:fs/promises';

import {
  dockerCaCertPath, dockerHost, dockerPort,
  dockerProtocol, dockerTlsCertPath, dockerTlsKeyPath,
} from '../config.js';

async function createDockerClient(): Promise<Docker> {
  const caCert = dockerCaCertPath ? await fsAsync.readFile(dockerCaCertPath) : undefined;
  const tlsCert = dockerTlsCertPath ? await fsAsync.readFile(dockerTlsCertPath) : undefined;
  const tlsKey = dockerTlsKeyPath ? await fsAsync.readFile(dockerTlsKeyPath) : undefined;

  // remote connection to docker daemon
  return new Docker({
    host: dockerHost,
    port: dockerPort,
    protocol: dockerProtocol,
    ca: caCert,
    cert: tlsCert,
    key: tlsKey,
  });
}

let dockerSingleton: Docker | undefined;

export default async function getDocker(): Promise<Docker> {
  if (dockerSingleton === undefined) {
    dockerSingleton = await createDockerClient();
  }
  return dockerSingleton;
}
