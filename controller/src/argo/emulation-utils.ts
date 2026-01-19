/// <reference types="node" />
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

import {
  CREATESCRIPTPATH_DEBIAN,
  CREATESCRIPTPATH_WSL,
  DELETE_SCRIPT_PATH,
  K3S_TOKEN_SECRET,
} from '../config.js';

// Detect host OS
function detectHostOS(): 'wsl-ubuntu24' | 'debian13' | 'unknown' {
  const readFirstAvailable = (paths: string[]): string => {
    for (const path of paths) {
      try {
        if (existsSync(path)) {
          return readFileSync(path, { encoding: 'utf8' });
        }
      } catch {
        continue;
      }
    }
    return '';
  };

  const osRelease = readFirstAvailable([
    '/host/etc/os-release',
    '/etc/os-release',
  ]);
  const procVersion = readFirstAvailable([
    '/host/proc/version',
    '/proc/version',
  ]);

  if (!osRelease || !procVersion) {
    console.error('[ERROR] Unable to detect OS: missing host metadata files');
    return 'unknown';
  }

  // --- Detect WSL ---
  const isWSL = procVersion.toLowerCase().includes('microsoft')
    || procVersion.toLowerCase().includes('wsl')
    || Boolean(process.env.WSL_INTEROP)
    || Boolean(process.env.WSL_DISTRO_NAME)
    || osRelease.toLowerCase().includes('wsl');

  if (isWSL) {
    return 'wsl-ubuntu24';
  }

  if (
    osRelease.includes('Debian')
    && osRelease.includes('13')
  ) {
    return 'debian13';
  }

  return 'unknown';
}

// Choose script based on OS
function getScriptPath() {
  const osType = detectHostOS();

  switch (osType) {
    case 'wsl-ubuntu24': {
      console.log('[INFO] Host detected: WSL Ubuntu 24.04 → using script1');
      return CREATESCRIPTPATH_WSL;
    }

    case 'debian13': {
      console.log('[INFO] Host detected: Debian 13 → using script2');
      return CREATESCRIPTPATH_DEBIAN;
    }

    default: {
      console.log('[WARN] Unknown OS, using fallback script');
      return CREATESCRIPTPATH_WSL;
    }
  }
}

// Create Kubernetes node
export default function createKubeNode(
  nodeName: string,
  memory: string,
  cpus: string,
  os: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = getScriptPath();
    let stderrData = '';

    const script = spawn('sh', [
      scriptPath,
      nodeName,
      memory,
      cpus,
      os,
      K3S_TOKEN_SECRET,
    ]);

    script.stdout.on('data', (data: Buffer) => {
      console.log(data.toString().trim());
    });

    script.stderr.on('data', (data: Buffer) => {
      const error = data.toString().trim();
      stderrData += `${error}\n`;
      console.error(`[STDERR] ${error}`);
    });

    script.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(`Node ${nodeName} created successfully.`);
      } else {
        reject(
          new Error(
            `[ERROR] Script exited with code ${code}. STDERR:\n${stderrData}`,
          ),
        );
      }
    });
  });
}

// Delete Kubernetes node
export function deleteKubeNode(nodeName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`[INFO] Starting Kubernetes node deletion: ${nodeName}`);

    let stderrData = '';
    const script = spawn('sh', [DELETE_SCRIPT_PATH, nodeName]);

    script.stdout.on('data', (data: Buffer) => {
      console.log(data.toString().trim());
    });

    script.stderr.on('data', (data: Buffer) => {
      const error = data.toString().trim();
      stderrData += `${error}\n`;
      console.error(`[STDERR] ${error}`);
    });

    script.on('close', (code: number | null) => {
      if (code === 0) {
        resolve(`Node ${nodeName} deleted successfully.`);
      } else {
        reject(
          new Error(
            `[ERROR] Script exited with code ${code}. STDERR:\n${stderrData}`,
          ),
        );
      }
    });
  });
}
