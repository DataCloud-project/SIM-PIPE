/// <reference types="node" />
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

import {
  CREATESCRIPTPATH_DEBIAN,
  CREATESCRIPTPATH_WSL,
  DELETE_SCRIPT_PATH,
  K3S_TOKEN_SECRET,
} from '../config.js';

function parseOsRelease(content: string): Record<string, string> {
  const result: Record<string, string> = {};

  content.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;

    const [key, ...rest] = trimmed.split('=');
    if (!key || rest.length === 0) return;

    let value = rest.join('=');
    value = value.replace(/^"/, '').replace(/"$/, '');
    result[key] = value;
  });

  return result;
}

// Detect host OS (based on host /etc/os-release and /proc/version mounted into the pod)
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

  // IMPORTANT: Only look at the host filesystem, never the container rootfs.
  // /host/proc is a mount of the host /proc into the controller pod. Using
  // /host/proc/1/root/etc/os-release reads the real host OS release file.
  const osRelease = readFirstAvailable([
    '/host/proc/1/root/etc/os-release',
    '/host/etc/os-release',
  ]);
  const procVersion = readFirstAvailable([
    '/host/proc/version',
  ]);

  if (!osRelease || !procVersion) {
    console.error('[ERROR] Unable to detect OS: missing host metadata files');
    return 'unknown';
  }

  const osInfo = parseOsRelease(osRelease);

  // Debug info to understand what the controller actually sees
  // eslint-disable-next-line no-console
  console.log('[EMULATION] Host OS detection', {
    ID: osInfo.ID,
    VERSION_ID: osInfo.VERSION_ID,
    VERSION_CODENAME: osInfo.VERSION_CODENAME,
  });

  // --- Detect WSL ---
  const isWSL = procVersion.toLowerCase().includes('microsoft')
    || procVersion.toLowerCase().includes('wsl')
    || Boolean(process.env.WSL_INTEROP)
    || Boolean(process.env.WSL_DISTRO_NAME)
    || osRelease.toLowerCase().includes('wsl');

  if (isWSL) {
    return 'wsl-ubuntu24';
  }

  // Prefer structured fields from /etc/os-release when available
  // For our purposes, any Debian host should use the Debian emulation script,
  // we don't need to distinguish specific major versions.
  if (osInfo.ID === 'debian') {
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
