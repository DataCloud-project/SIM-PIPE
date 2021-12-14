// https://openbase.com/js/node-sftp-client/documentation

import config from 'config';
import fs from 'node:fs';
import asyncFs from 'node:fs/promises';
import Client from 'ssh2-sftp-client';

const sftp = new Client();

const flag = process.argv[2];

const inputFile = config.get<string>('input_file');
// const remoteInputFile = config.get('remote_sftp_dir') + '/in/input.txt';
// const remoteOutputFile = config.get('remote_sftp_dir') + '/out/output.txt';

const remoteInputFile = 'in/input.txt';
const remoteOutputFile = 'out/output.txt';

const simId = config.get<string>('sim_id');
const runId = config.get<string>('run_id');
const stepNumber = config.get<string>('step_number');

const targetDirectory = `./${simId}/${runId}/${stepNumber}`;

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
    }));
  } finally {
    await sftp.end();
  }
}

fs.mkdirSync(targetDirectory, { recursive: true });
switch (flag) {
  case 'put': {
    await putToSandbox(inputFile, remoteInputFile, `${targetDirectory}/input.txt`);
    break;
  }
  case 'get': {
    await getFromSandbox(remoteOutputFile, `${targetDirectory}/output.txt`);
    break;
  }
  case 'clear': {
    await clearSandbox();
    break;
  }
  default:
    throw new Error('Unknown flag');
}
