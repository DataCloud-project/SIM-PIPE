import fs from 'node:fs';
import asyncFs from 'node:fs/promises';
import Client from 'ssh2-sftp-client';

import logger from './logger.js';

// https://openbase.com/js/node-sftp-client/documentation
const sftp = new Client();

const simId = process.env.SIM_ID;
const runId = process.env.RUN_ID;
const stepNumber = process.env.STEP_NUMBER;

if (!simId || !runId || !stepNumber) {
  throw new Error('Missing environment variables: SIM_ID, RUN_ID, STEP_NUMBER');
}

// Create folder to store the simulation details
const targetDirectory = `./${simId}/${runId}/${stepNumber}`;
fs.mkdirSync(targetDirectory, { recursive: true });

const options = {
  host: '127.0.0.1',
  port: 2222,
  username: 'user1',
  password: 'user1',
};

export async function putToSandbox(
  localFile: string, remoteFile: string, storageFile: string,
) : Promise<void> {
  // store input file to the target directory
  await asyncFs.copyFile(localFile, storageFile);

  // send input file to the sandbox
  await sftp.connect(options);
  try {
    await sftp.put(localFile, remoteFile);
    logger.info('Sent similation input to Sandbox');
  } finally {
    await sftp.end();
  }
}

export async function getFromSandbox(
  remoteFile: string, storeOutputFile: string) : Promise<void> {
  const destination = fs.createWriteStream(storeOutputFile);
  await sftp.connect(options);
  try {
    await sftp.get(remoteFile, destination);
    logger.info('Collected simulation output from Sandbox');
  } finally {
    await sftp.end();
  }
}

export async function clearSandbox() : Promise<void> {
  await sftp.connect(options);
  try {
    const directoryList = ['./in/', './out/', './work/'];
    // List files in parallel
    const fileList = await Promise.all(directoryList.map(async (directory) => {
      const files = await sftp.list(directory);
      return files.map((file) => `${directory}${file.name}`);
    }));
    // Delete everything in parallel, if it's too slow or failing
    // consider using the p-limit package
    await Promise.all(fileList.flat().map(async (file) => {
      await sftp.delete(file);
      logger.info(`Deleted ${file} from Sandbox`);
    }));
  } finally {
    await sftp.end();
  }
}
