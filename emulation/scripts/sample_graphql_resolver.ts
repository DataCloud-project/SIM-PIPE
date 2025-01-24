const { spawn } = require("child_process");

// TODO: move constants (to be set by user) to config/env in helm
const K3S_SERVER_URL = 'https://' + '<add-k3s-server-url>' + ':6443';
const K3STOKEN = '<add-k3s-token>';

// setting some constants for creating a new node in the cluster
const SCRIPTPATH = "./create_kube_node.sh"; // Path to the shell script
const QCOW2_IMAGE_FILE = 'os.qcow2' 
const CLOUD_INIT_FILE = 'cloud-init.iso'

// TODO: replace: Testing sample values with Ubuntu OS image (with input from frontend)
const nodeName = 'kube-node';
const memory = '4096';
const cpus = '2';
const timeout = '600';
const os = "ubuntu-20" // ubuntu-20, ubuntu-22

// Spawn the shell script
const script = spawn("sh", [SCRIPTPATH, K3S_SERVER_URL, K3STOKEN, nodeName, memory, cpus, timeout, os, QCOW2_IMAGE_FILE, CLOUD_INIT_FILE]);

// Handle standard output
script.stdout.on("data", (data) => {
  console.log(data.toString());
});

// Handle standard error
script.stderr.on("data", (data) => {
  console.error(data.toString());
});

// Handle script errors
script.on("error", (err) => {
  console.error(`${err.message}`);
});
