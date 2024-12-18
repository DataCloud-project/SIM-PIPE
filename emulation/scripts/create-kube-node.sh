#!/bin/bash

# Parameters
K3S_SERVER_URL=${1:-"https://172.18.107.219:6443"}  # Default K3S server URL
K3S_SERVER_URL=${1:-"https://$(hostname -I | awk '{print $1}'):6443"}  # Default K3S server URL
K3S_TOKEN=${2:-$(sudo cat /var/lib/rancher/k3s/server/node-token)}  # Retrieve K3S token
NODE_NAME=${3:-"kube-node"}  # Default node name
OS_IMAGE_URL="https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img"  # Ubuntu OS image
QCOW2_IMAGE_FILE="ubuntu-cloud.qcow2"  # QCOW2 image file name
CLOUD_INIT_ISO="cloud-init.iso"  # Cloud-init ISO name
MEMORY=${4:-4096}  # Default memory size (in MB)
CPUS=${5:-2}  # Default number of CPUs
TIMEOUT=${6:-600}  # Timeout for waiting for the node to be ready (in seconds)

# Function: Log a message with timestamp and level
function log_message {
  local level="$1"
  local message="$2"
  echo -e "$(date +'%Y-%m-%d %H:%M:%S') [${level}] ${message}"
}

# Function: Check command availability
function check_command {
  if ! command -v "$1" &>/dev/null; then
    log_message "ERROR" "$1 is not installed or not in PATH."
    exit 1
  fi
}

# Ensure required commands are available
log_message "INFO" "Checking required commands..."
check_command wget
check_command qemu-img
check_command qemu-system-x86_64
check_command kubectl
check_command cloud-localds

# Step 1: Create user-data file for cloud-init
log_message "INFO" "Creating user-data file for cloud-init..."
# cat <<EOF > user-data
# #cloud-config
# runcmd:
#   - export K3S_URL=$K3S_SERVER_URL
#   - export K3S_TOKEN=$K3S_TOKEN
#   - curl -sfL https://get.k3s.io | sh -
# EOF
cat <<EOF > user-data
#cloud-config
runcmd:
  - curl -sfL https://get.k3s.io | K3S_URL=$K3S_SERVER_URL K3S_TOKEN=$K3S_TOKEN sh -
EOF

# Step 2: Create meta-data file for cloud-init
log_message "INFO" "Creating meta-data file for cloud-init..."
cat <<EOF > meta-data
# meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

# Step 3: Create cloud-init ISO
log_message "INFO" "Creating cloud-init ISO..."
cloud-localds $CLOUD_INIT_ISO user-data meta-data

# Step 4: Download and prepare the OS image
if [ ! -f "$QCOW2_IMAGE_FILE" ]; then
  log_message "INFO" "Downloading and resizing the OS image..."
  wget $OS_IMAGE_URL -O $QCOW2_IMAGE_FILE && qemu-img resize $QCOW2_IMAGE_FILE 10G
else
  log_message "INFO" "OS image already exists. Skipping download."
fi

# Step 5: Start the VM in the background
log_message "INFO" "Starting the VM with name: $NODE_NAME..."
qemu-system-x86_64 -m $MEMORY -smp cpus=$CPUS \
  -drive file=$QCOW2_IMAGE_FILE,if=virtio \
  -drive file=$CLOUD_INIT_ISO,format=raw,if=virtio \
  -netdev user,id=mynet0 \
  -device e1000,netdev=mynet0 \
  -nographic -serial none -monitor none &

# Step 6: Wait for the VM to initialize
log_message "INFO" "Waiting for Kubernetes node $NODE_NAME to be ready..."
sleep 60

# Step 7: Wait for the Kubernetes node to be ready
START_TIME=$(date +%s)
while true; do
  if kubectl get nodes "$NODE_NAME" 2>/dev/null | grep -q " Ready "; then
    log_message "SUCCESS" "Node $NODE_NAME is now ready!"
    break
  fi

  # Check timeout
  CURRENT_TIME=$(date +%s)
  if (( CURRENT_TIME - START_TIME > TIMEOUT )); then
    log_message "ERROR" "Timed out waiting for node $NODE_NAME to be ready. Exiting."
    exit 1
  fi

  sleep 5
done

# Step 8: Assign worker role to the new node
log_message "INFO" "Assigning worker role to the new node..."
kubectl label node $NODE_NAME node-role.kubernetes.io/worker=worker

log_message "SUCCESS" "New node $NODE_NAME has been successfully added to the cluster!"
log_message "INFO" "Use the cleanup script to remove the node when it is no longer needed."
