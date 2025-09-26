import { spawn } from 'node:child_process';

import { CREATESCRIPTPATH, DELETE_SCRIPT_PATH, K3S_TOKEN_SECRET } from '../config.js';

// Function to create a Kubernetes node
export default function createKubeNode(
  nodeName: string,
  memory: string,
  cpus: string,
  os: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`[INFO] Starting Kubernetes node creation: ${nodeName}`);

    const script = spawn('sh', [
      CREATESCRIPTPATH,
      nodeName,
      memory,
      cpus,
      os,
      K3S_TOKEN_SECRET,
    ]);

    // Handle standard output
    script.stdout.on('data', (data: { toString: () => string; }) => {
      console.log(`${data.toString().trim()}`);
    });

    // Handle errors
    script.stderr.on('data', (data: { toString: () => string; }) => {
      console.error(`${data.toString().trim()}`);
    });

    script.on('close', (code: number) => {
      if (code === 0) {
        console.log(`[SUCCESS] Node ${nodeName} created successfully.`);
        resolve(`Node ${nodeName} created successfully.`);
      } else {
        console.error(`[ERROR] Script exited with code ${code}`);
        reject(new Error(`[ERROR] Script exited with code ${code}. STDERR: ${stderrData}`));
      }
    });

    // Capture detailed stderr output
    let stderrData = '';
    script.stderr.on('data', (data: { toString: () => string; }) => {
      const errorOutput = data.toString().trim();
      stderrData += `${errorOutput}\n`;
      console.error(`[STDERR] ${errorOutput}`);
    });
  });
}

// Function to delete a Kubernetes node
export function deleteKubeNode(nodeName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`[INFO] Starting Kubernetes node deletion: ${nodeName}`);

    const script = spawn('sh', [
      DELETE_SCRIPT_PATH,
      nodeName,
    ]);

    script.stdout.on('data', (data: { toString: () => string }) => {
      console.log(`${data.toString().trim()}`);
    });

    script.stderr.on('data', (data: { toString: () => string }) => {
      console.error(`${data.toString().trim()}`);
    });

    script.on('close', (code: number) => {
      if (code === 0) {
        console.log(`[SUCCESS] Node ${nodeName} deleted successfully.`);
        resolve(`Node ${nodeName} deleted successfully.`);
      } else {
        console.error(`[ERROR] Script exited with code ${code}`);
        reject(new Error(`[ERROR] Script exited with code ${code}`));
      }
    });

    let stderrData = '';
    script.stderr.on('data', (data: { toString: () => string; }) => {
      const errorOutput = data.toString().trim();
      stderrData += `${errorOutput}\n`;
      console.error(`[STDERR] ${errorOutput}`);
    });
  });
}
