#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

# Input arguments
K3S_TOKEN_SECRET=${1}  
NODE_NAME=${2} 
MEMORY=${3}
CPUS=${4}
TIMEOUT=${5}
OS=${6}
QCOW2_IMAGE_FILE=${7}  
CLOUD_INIT_ISO=${8}  

# Validate input arguments
if [ $# -ne 8 ]; then
  echo "Usage: $0 <K3S_TOKEN_SECRET> <NODE_NAME> <MEMORY> <CPUS> <TIMEOUT> <OS> <QCOW2_IMAGE_FILE> <CLOUD_INIT_ISO>"
  exit 1
fi

# Function: Log messages with timestamp
log_message() {
  echo "$(date +'%Y-%m-%d %H:%M:%S') [$1] $2"
}

# Function: Fetch K3S cluster details
fetch_k3s_details() {
  log_message "INFO" "Fetching Kubernetes cluster details..."
  K3S_SERVER_IP=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.K3S_SERVER_IP}' | base64 -d)
  K3S_TOKEN=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.token}' | base64 -d)

  if [ -z "$K3S_TOKEN" ]; then
    log_message "ERROR" "Failed to retrieve K3S token."
    exit 1
  fi

  K3S_SERVER_URL="https://${K3S_SERVER_IP}:6443"
}

# Function: Download and prepare OS image
prepare_os_image() {
  case "$OS" in
    "ubuntu-18") OS_IMAGE_URL="https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img" ;;
    "ubuntu-20") OS_IMAGE_URL="https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img" ;;
    "ubuntu-22") OS_IMAGE_URL="https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img" ;;
    "ubuntu-24") OS_IMAGE_URL="https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img" ;;
    *) log_message "ERROR" "Unsupported OS type: $OS"; exit 1 ;;
  esac

  log_message "INFO" "Downloading and preparing OS image..."
  wget --quiet "$OS_IMAGE_URL" -O "$QCOW2_IMAGE_FILE" && qemu-img resize "$QCOW2_IMAGE_FILE" 10G
}

# Function: Check if required commands are installed
check_dependencies() {
  log_message "INFO" "Verifying required commands..."
  for cmd in wget qemu-img qemu-system-x86_64 kubectl cloud-localds; do
    command -v "$cmd" >/dev/null 2>&1 || { log_message "ERROR" "$cmd not found. Install it before proceeding."; exit 1; }
  done
}

# Function: Wait for Kubernetes node readiness
wait_for_node_ready() {
  log_message "INFO" "Waiting for node $NODE_NAME to be ready..."
  START_TIME=$(date +%s)

  while ! kubectl get nodes "$NODE_NAME" 2>/dev/null | grep -q " Ready "; do
    if [ $(( $(date +%s) - START_TIME )) -gt "$TIMEOUT" ]; then
      log_message "ERROR" "Timed out waiting for node readiness."
      exit 1
    fi
    sleep 5
  done

  log_message "SUCCESS" "Node $NODE_NAME is ready."
}

# Main execution
check_dependencies
fetch_k3s_details

# Step 1: Create cloud-init configuration
log_message "INFO" "Generating cloud-init configuration..."
cat <<EOF > user-data
#cloud-config
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo,containerd,cni
runcmd:
  - curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_URL=$K3S_SERVER_URL K3S_TOKEN=$K3S_TOKEN sh -
EOF

cat <<EOF > meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

bash cloud-localds "$CLOUD_INIT_ISO" user-data meta-data

# Step 2: Prepare OS image
prepare_os_image

# Step 3: Start the VM
log_message "INFO" "Starting VM: $NODE_NAME..."
nohup qemu-system-x86_64 -m "$MEMORY" -smp "$CPUS" \
  -drive file="$QCOW2_IMAGE_FILE",if=virtio \
  -drive file="$CLOUD_INIT_ISO",format=raw,if=virtio \
  -netdev user,id=mynet0 \
  -device e1000,netdev=mynet0 \
  -nographic -serial none -monitor none -bios /usr/share/qemu/bios-256k.bin > ./log.txt 2>&1 &

sleep 60  # Initial wait time before checking node readiness

# Step 4: Verify node readiness
wait_for_node_ready

# Step 5: Label the new node as a worker
log_message "INFO" "Labeling node $NODE_NAME as worker..."
kubectl label node "$NODE_NAME" node-role.kubernetes.io/worker=worker

log_message "SUCCESS" "Node $NODE_NAME successfully added to the cluster."
