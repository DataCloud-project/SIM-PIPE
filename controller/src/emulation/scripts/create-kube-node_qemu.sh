#!/bin/sh

set -euo pipefail # Exit on error, unset vars, or failed pipeline

# Basic pre-flight checks to fail fast with clear messages
require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "[ERROR] Missing required command: $1" >&2
    exit 1
  fi
}

require_cmd kubectl
require_cmd qemu-system-x86_64
require_cmd qemu-img
require_cmd cloud-localds

# Ensure host tmp mount exists and is writable
if [ ! -d /host-tmp-vm ] || [ ! -w /host-tmp-vm ]; then
  echo "[ERROR] /host-tmp-vm is missing or not writable; ensure the host path is mounted" >&2
  exit 1
fi

# Input arguments

NODE_NAME=${1:-"node27"}
MEMORY=${2:-4096}
CPUS=${3:-2}
OS=${4:-"ubuntu-20"}
K3S_TOKEN_SECRET=${5:-"k3s-cluster-secret"}

TIMEOUT=${6:-600}
QCOW2_IMAGE_FILE="${NODE_NAME}-os.qcow2"
CLOUD_INIT_ISO="${NODE_NAME}-cloud.iso"

TAP_INTERFACE="tap-${NODE_NAME}"

# Directory on the host-mounted path where base OS images are cached.
# This path survives pod restarts because /host-tmp-vm is a hostPath mount.
IMAGE_CACHE_DIR="/host-tmp-vm/images"

# Function: Log messages with timestamp
log_message() {
 echo "$(date +'%-Y-%-m-%-d %H:%M:%S') [$1] $2"
}

# Ensure the base image for $1 OS type is present in IMAGE_CACHE_DIR,
# downloading it on first use. Sets BASE_IMAGE_PATH to the resolved path.
# Uses a lockdir to safely handle concurrent calls for the same OS type.
ensure_os_image() {
  local os="$1"
  local dest="${IMAGE_CACHE_DIR}/${os}.qcow2"
  local lock="${dest}.downloading"
  mkdir -p "$IMAGE_CACHE_DIR"

  if [ ! -f "$dest" ]; then
    if mkdir "$lock" 2>/dev/null; then
      # This process owns the download
      local url
      case "$os" in
        "ubuntu-18") url="https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img" ;;
        "ubuntu-20") url="https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img" ;;
        "ubuntu-22") url="https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img" ;;
        "ubuntu-24") url="https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img" ;;
        *) rmdir "$lock"; log_message "ERROR" "Unsupported OS type: $os"; exit 1 ;;
      esac
      log_message "INFO" "Downloading $os base image (first use only, ~500 MB)..."
      if wget -O "${dest}.tmp" "$url"; then
        mv "${dest}.tmp" "$dest"
        log_message "INFO" "Cached $os image at $dest"
      else
        rm -f "${dest}.tmp"
        rmdir "$lock"
        log_message "ERROR" "Failed to download $os image from $url"
        exit 1
      fi
      rmdir "$lock"
    else
      # Another process is downloading the same image; wait for it to finish
      log_message "INFO" "Waiting for concurrent download of $os image to complete..."
      while [ -d "$lock" ]; do sleep 3; done
      if [ ! -f "$dest" ]; then
        log_message "ERROR" "Concurrent download of $os image failed."
        exit 1
      fi
    fi
  fi

  BASE_IMAGE_PATH="$dest"
}

# Ensure Debian host bridge, NAT, and qemu-ifup/ifdown are configured.
# This script is idempotent and safe to run multiple times.
if [ -x /app/setup-debian-host.sh ]; then
  log_message "INFO" "Running Debian host network setup script..."
  /app/setup-debian-host.sh || log_message "ERROR" "setup-debian-host.sh failed"
fi

select_os_image() {
  log_message "INFO" "Ensuring OS image is available for $OS..."
  ensure_os_image "$OS"
  qemu-img create -f qcow2 -F qcow2 -b "$BASE_IMAGE_PATH" "${QCOW2_IMAGE_FILE}" 10G
}

# Function: Fetch K3S cluster details
fetch_k3s_details() {
  log_message "INFO" "Fetching Kubernetes cluster details..."
  K3S_SERVER_IP=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.K3S_SERVER_IP}' 2>/dev/null | base64 -d || true)
  K3S_TOKEN=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.token}' 2>/dev/null | base64 -d || true)

  if [ -z "$K3S_TOKEN" ]; then
    log_message "ERROR" "Failed to retrieve K3S token from secret ${K3S_TOKEN_SECRET}."
    exit 1
  fi

  if [ -z "$K3S_SERVER_IP" ]; then
    log_message "ERROR" "K3S_SERVER_IP missing in secret ${K3S_TOKEN_SECRET}."
    exit 1
  fi

  K3S_SERVER_URL="https://${K3S_SERVER_IP}:6443"

}

fetch_k3s_details

# Step 1: Create cloud-init configuration
log_message "INFO" "Generating cloud-init configuration..."
cat <<EOF > user-data
#cloud-config
ssh_deletekeys: true
ssh_pwauth: true
disable_root: true
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: docker
    shell: /bin/bash
    lock_passwd: false

package_update: false
package_upgrade: false
packages:
  - docker.io

runcmd:
  # Set ubuntu password
  - echo "ubuntu:ubuntu" | chpasswd

  # - apt-get install -y docker.io
  - systemctl enable docker
  - systemctl start docker
  - bash -c 'until systemctl is-active --quiet docker; do sleep 1; done'

  # Open required firewall ports
  - iptables -A INPUT -p tcp --dport 10250 -j ACCEPT
  - iptables -A INPUT -p tcp --dport 6443 -j ACCEPT
  - iptables -A INPUT -p udp --dport 8472 -j ACCEPT

  # Start K3s agent only after Docker is ready
  - curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.33.4+k3s1 INSTALL_K3S_EXEC="agent --docker" K3S_URL=${K3S_SERVER_URL} K3S_TOKEN=${K3S_TOKEN} sh -
EOF

IP_ADDR=${9:-"172.31.0.11"}

NODE_NUM=$(echo "$NODE_NAME" | grep -o '[0-9]*$')
if [ -n "$NODE_NUM" ]; then
  IP_ADDR="172.31.0.${NODE_NUM}"
  log_message "DEBUG" "Node name has numeric suffix → using IP ${IP_ADDR}"
else
  HASH_NUM=$(echo -n "$NODE_NAME" | cksum | awk '{print $1 % 200 + 20}')
  IP_ADDR="172.31.0.${HASH_NUM}"
  log_message "DEBUG" "Node name has no numeric suffix → hash(${NODE_NAME})=${HASH_NUM}, IP=${IP_ADDR}"
fi

# Log derived values
log_message "DEBUG" "NODE_NAME=${NODE_NAME}"
log_message "DEBUG" "QCOW2_IMAGE_FILE=${QCOW2_IMAGE_FILE}"
log_message "DEBUG" "CLOUD_INIT_ISO=${CLOUD_INIT_ISO}"
log_message "DEBUG" "TAP_INTERFACE=${TAP_INTERFACE}"
log_message "DEBUG" "IP_ADDR=${IP_ADDR}"
log_message "DEBUG" "K3S_SERVER_URL=${K3S_SERVER_URL}"
log_message "DEBUG" "K3S_TOKEN=${K3S_TOKEN}"

cat <<EOF > network-config
network:
  version: 2
  renderer: networkd
  ethernets:
    anynic:
      match:
        name: en*
      dhcp4: false
      addresses:
        - ${IP_ADDR}/24
      gateway4: 172.31.0.1
      nameservers:
        addresses:
          - 8.8.8.8
EOF

cat <<EOF > meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

bash cloud-localds "$CLOUD_INIT_ISO" --network-config=network-config user-data meta-data

# Step 2: Select OS image
select_os_image

cp "$QCOW2_IMAGE_FILE" "/host-tmp-vm/${QCOW2_IMAGE_FILE}"
cp "$CLOUD_INIT_ISO" "/host-tmp-vm/${CLOUD_INIT_ISO}"

# Step 3: RUN QEMU with linux bridge
log_message "INFO" "Starting QEMU for node ${NODE_NAME}"

# QEMU_COMMAND="
# nsenter -t 1 -m -u --net=/host/proc/1/ns/net -i -p -- \
# /usr/bin/qemu-system-x86_64 \
#   -m "${MEMORY}" -smp "${CPUS}" \
#   -drive file="/host-tmp-vm/${QCOW2_IMAGE_FILE}",if=virtio,cache=directsync,discard=unmap,format=qcow2,aio=native \
#   -drive file="/host-tmp-vm/${CLOUD_INIT_ISO}",format=raw,if=virtio,cache=writeback,aio=threads \
#   -netdev tap,id=mynet0,ifname="${TAP_INTERFACE}",script=/etc/qemu-ifup,downscript=/etc/qemu-ifdown \
#   -device virtio-net-pci,netdev=mynet0 \
#   -machine q35,accel=kvm,usb=off \
#   -cpu host \
#   -enable-kvm \
#   -nographic \
#   -nodefaults \
#   -no-reboot -no-shutdown \
#   -serial mon:stdio
# "
QEMU_COMMAND="
nsenter -t 1 -m -u --net=/host/proc/1/ns/net -i -p -- \
/usr/bin/qemu-system-x86_64 \
  -m "${MEMORY}" -smp "${CPUS}" \
  -drive file="/host-tmp-vm/${QCOW2_IMAGE_FILE}",if=virtio,cache=directsync,discard=unmap,format=qcow2,aio=native \
  -drive file="/host-tmp-vm/${CLOUD_INIT_ISO}",format=raw,if=virtio,cache=writeback,aio=threads \
  -netdev tap,id=mynet0,ifname="${TAP_INTERFACE}",script=/etc/qemu-ifup,downscript=/etc/qemu-ifdown \
  -device virtio-net-pci,netdev=mynet0 \
  -machine q35,accel=kvm,usb=off \
  -cpu host \
  -enable-kvm \
  -nographic \
  -nodefaults \
  -no-reboot -no-shutdown \
  -daemonize \
  -serial file:/host-tmp-vm/${NODE_NAME}-console.log \
  -pidfile /host-tmp-vm/qemu-${NODE_NAME}.pid
"
log_message "DEBUG" "QEMU command: ${QEMU_COMMAND}"
eval "$QEMU_COMMAND"

BOOT_START_TIME=$(date +%s)
# eval ${QEMU_CMD} &
chown 1000:1000 /host-tmp-vm/*

# Step 6: Wait for the VM to initialize
log_message "INFO" "Waiting for Kubernetes node $NODE_NAME to be ready..."
sleep 20

# Step 7: Wait for the Kubernetes node to be ready
START_TIME=$(date +%s)
while true; do
  if kubectl get nodes "$NODE_NAME" 2>/dev/null | grep -q " Ready "; then
    BOOT_END_TIME=$(date +%s)
    BOOT_DURATION=$(( BOOT_END_TIME - BOOT_START_TIME ))
    log_message "INFO" "VM bootup for $NODE_NAME took ${BOOT_DURATION} seconds."
    break
  fi

  # Check timeout
  CURRENT_TIME=$(date +%s)
  if [ $(( CURRENT_TIME - START_TIME )) -gt $TIMEOUT ]; then
    log_message "ERROR" "Timed out waiting for node $NODE_NAME to be ready. Exiting."
    exit 1
  fi
  sleep 4
done

# Step 8: Assign worker role to the new node
log_message "INFO" "Assigning worker role to the new node..."
kubectl label node $NODE_NAME node-role.kubernetes.io/worker=worker

log_message "SUCCESS" "New node $NODE_NAME has been successfully added to the cluster!"
