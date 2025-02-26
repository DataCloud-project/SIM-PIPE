import { spawn } from "child_process";
import { k3sClusterSecret } from "../config.js";

// Constants TODO: move to a config file or environment variables
const SCRIPTPATH = "./create-kube-node.sh";
const QCOW2_IMAGE_FILE = "os.qcow2";
const CLOUD_INIT_FILE = "cloud-init.iso";

const K3S_TOKEN_SECRET =  k3sClusterSecret; 

// Function to create a Kubernetes node
export default function createKubeNode(
  nodeName: string,
  memory: string,
  cpus: string,
  timeout: string,
  os: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`[INFO] Starting Kubernetes node creation: ${nodeName}`);

    const script = spawn("sh", [
      SCRIPTPATH,
      K3S_TOKEN_SECRET,
      nodeName,
      memory,
      cpus,
      timeout,
      os,
      QCOW2_IMAGE_FILE,
      CLOUD_INIT_FILE,
    ]);

    // Handle standard output
    script.stdout.on("data", (data: { toString: () => string; }) => {
      console.log(`${data.toString().trim()}`);
    });

    // Handle errors
    script.stderr.on("data", (data: { toString: () => string; }) => {
      console.error(`${data.toString().trim()}`);
    });

    script.on("close", (code) => {
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
    script.stderr.on("data", (data) => {
      const errorOutput = data.toString().trim();
      stderrData += errorOutput + '\n';
      console.error(`[STDERR] ${errorOutput}`);
    });
  });
}
