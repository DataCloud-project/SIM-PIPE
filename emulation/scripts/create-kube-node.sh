#!/bin/sh

# Parameters
K3S_SERVER_URL=${1}
K3S_TOKEN=${2}  

NODE_NAME=${3} 
MEMORY=${4}
CPUS=${5}
TIMEOUT=${6}
OS_IMAGE_URL=${7}
OS=${8}

QCOW2_IMAGE_FILE=${9}  
CLOUD_INIT_ISO=${10}  

# Function: Log a message with timestamp and level
log_message() {
  level="$1"
  message="$2"
  echo "$(date +'%Y-%m-%d %H:%M:%S') [${level}] ${message}"
}

# Function: Set os image url based on the os type received
set_os_image_url() {
  case "$OS" in
    "ubuntu-20")
      OS_IMAGE_URL="https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img"
      log_message "INFO" "OS image URL set to: $OS_IMAGE_URL"
      ;;
    "ubuntu-22")
      OS_IMAGE_URL="https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img"
      log_message "INFO" "OS image URL set to: $OS_IMAGE_URL"
      ;;
    *)
      log_message "ERROR" "Unsupported OS type: $OS"
      exit 1
      ;;
  esac
}

# Function: Check command availability
check_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
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
cat <<EOF > user-data
#cloud-config
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo,containerd,cni
runcmd:
  - curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_URL=$K3S_SERVER_URL K3S_TOKEN=$K3S_TOKEN sh -
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
cloud-localds "$CLOUD_INIT_ISO" user-data meta-data

# Step 4: Download and prepare the OS image
# Setting OS image URL based on the OS type
set_os_image_url
log_message "INFO" "Downloading and resizing the OS image..."
wget --quiet "$OS_IMAGE_URL" -O "$QCOW2_IMAGE_FILE" && qemu-img resize "$QCOW2_IMAGE_FILE" 10G

# Step 5: Start the VM in the background
log_message "INFO" "Starting the VM with name: $NODE_NAME..."
nohup qemu-system-x86_64 -m "$MEMORY" -smp cpus="$CPUS" \
  -drive file="$QCOW2_IMAGE_FILE",if=virtio \
  -drive file="$CLOUD_INIT_ISO",format=raw,if=virtio \
  -netdev user,id=mynet0 \
  -device e1000,netdev=mynet0 \
  -nographic -serial none -monitor none > /dev/null 2>&1 &

# Step 6: Wait for the VM to initialize
log_message "INFO" "Waiting for Kubernetes node $NODE_NAME to be ready..."
sleep 60

# Step 7: Wait for the Kubernetes node to be ready
START_TIME=$(date +%s)
while true; do
  if kubectl get nodes "$NODE_NAME" 2>/dev/null | grep -q " Ready "; then
    log_message "SUCCESS" "Node $NODE_NAME is ready"
    break
  fi

  # Check timeout
  CURRENT_TIME=$(date +%s)
  if [ $((CURRENT_TIME - START_TIME)) -gt "$TIMEOUT" ]; then
    log_message "ERROR" "Timed out waiting for node $NODE_NAME to be ready. Exiting."
    exit 1
  fi

  sleep 5
done

# Step 8: Assign worker role to the new node
log_message "INFO" "Assigning worker role to the new node..."
kubectl label node "$NODE_NAME" node-role.kubernetes.io/worker=worker

log_message "SUCCESS" "New node $NODE_NAME has been successfully added to the cluster!"
