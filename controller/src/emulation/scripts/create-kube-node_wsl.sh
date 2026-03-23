#!/bin/sh

set -e

# Input arguments
NODE_NAME=${1:-"node27"}
MEMORY=${2:-4096}
CPUS=${3:-2}
OS=${4:-"ubuntu-20"}
K3S_TOKEN_SECRET=${5:-"k3s-cluster-secret"}
TIMEOUT=${6:-1200}
K3S_VERSION=${7:-""}  # Pin a version or leave empty for latest stable
# Use stable channel when no version is pinned; otherwise pin to the provided version
K3S_VERSION_FLAG="${K3S_VERSION:+INSTALL_K3S_VERSION=}${K3S_VERSION:-INSTALL_K3S_CHANNEL=stable}"

# File Paths
QCOW2_IMAGE_FILE="${NODE_NAME}-os.qcow2"
CLOUD_INIT_ISO="${NODE_NAME}-cloud.iso"
TAP_INTERFACE="tap-${NODE_NAME}"

# Directory on the host-mounted path where base OS images are cached.
# This path survives pod restarts because /host-tmp-vm is a hostPath mount.
IMAGE_CACHE_DIR="/host-tmp-vm/images"

log_message() { echo "$(date +'%-Y-%-m-%-d %H:%M:%S') [$1] $2"; }

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

# Networking: derive IP from NODE_NAME to allow multiple nodes without collisions
BASE_PREFIX="172.30.0"
GATEWAY="172.30.0.1"

NODE_NUM=$(echo "$NODE_NAME" | grep -o '[0-9]*$')
if [ -n "$NODE_NUM" ]; then
  PREFIX=${NODE_NAME%"$NODE_NUM"}
else
  PREFIX=$NODE_NAME
  NODE_NUM=0
fi

HASH_NUM=$(echo -n "$PREFIX" | cksum | awk '{print $1}')
LAST_OCTET=$(( (HASH_NUM + NODE_NUM) % 200 + 20 ))
IP_ADDR="${BASE_PREFIX}.${LAST_OCTET}"
log_message "DEBUG" "Derived IP ${IP_ADDR} from name ${NODE_NAME} (prefix=${PREFIX}, suffix=${NODE_NUM})"

# Use controller pod resolver (kube-dns) for guest DNS
DNS1=""
if [ -r /etc/resolv.conf ]; then
  DNS1=$(awk '/^nameserver/{print $2; exit}' /etc/resolv.conf)
fi
if [ -z "$DNS1" ]; then
  DNS1="10.43.0.10"
fi
log_message "INFO" "Using DNS server: ${DNS1}"

# Ensure WSL host bridge, NAT, and qemu-ifup/ifdown are configured.
# This script is idempotent and safe to run multiple times.
if [ -x /app/setup-wsl-host.sh ]; then
  log_message "INFO" "Running WSL host network setup script..."
  /app/setup-wsl-host.sh || log_message "ERROR" "setup-wsl-host.sh failed"
fi

select_os_image() {
  log_message "INFO" "Ensuring OS image is available for $OS..."
  ensure_os_image "$OS"
  qemu-img create -f qcow2 -F qcow2 -b "$BASE_IMAGE_PATH" "${QCOW2_IMAGE_FILE}" 10G
}

fetch_k3s_details() {
  log_message "INFO" "Fetching Kubernetes cluster details..."
  K3S_TOKEN=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.token}' | base64 -d)
  K3S_SERVER_URL="https://${GATEWAY}:6443"
}

fetch_k3s_details

# --- CLOUD INIT GENERATION ---
log_message "INFO" "Generating cloud-init configuration..."
cat <<EOF > user-data
#cloud-config
ssh_deletekeys: true
ssh_pwauth: true
disable_root: true
users:
  - name: user
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: docker
    shell: /bin/bash
    lock_passwd: false

package_update: false
package_upgrade: false
packages:
  - docker.io

runcmd:
  # Set user password
  - echo "user:user" | chpasswd
  - systemctl enable docker
  - systemctl start docker
  - bash -c 'until systemctl is-active --quiet docker; do sleep 1; done'

  # Force a static resolv.conf (avoid systemd-resolved stub)
  - systemctl disable --now systemd-resolved || true
  - rm -f /etc/resolv.conf
  - bash -c 'printf "nameserver ${DNS1}\n" > /etc/resolv.conf'

  # Remove incorrect default route via lo (workaround for netplan bug)
  - bash -c 'ip route del default via 172.30.0.1 dev lo || true'

  # Start K3s agent (let k3s/flannel pick the interface/IP based on the node name)
  - curl -sfL https://get.k3s.io | ${K3S_VERSION_FLAG} INSTALL_K3S_EXEC="agent --docker --node-name ${NODE_NAME}" K3S_URL=${K3S_SERVER_URL} K3S_TOKEN=${K3S_TOKEN} sh -
EOF

# Network Config (Static IP within the Bridge Range, robust NIC matching)
cat <<EOF > network-config
network:
  version: 2
  renderer: networkd
  ethernets:
    anynic:
      match:
        name: "e*"
      dhcp4: false
      gateway4: ${GATEWAY}
      addresses:
        - ${IP_ADDR}/24
      nameservers:
        addresses:
          - ${DNS1}
EOF

cat <<EOF > meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

bash cloud-localds "$CLOUD_INIT_ISO" --network-config=network-config user-data meta-data
select_os_image
cp "$QCOW2_IMAGE_FILE" "/host-tmp-vm/${QCOW2_IMAGE_FILE}"
cp "$CLOUD_INIT_ISO" "/host-tmp-vm/${CLOUD_INIT_ISO}"

log_message "INFO" "Starting QEMU for node ${NODE_NAME}"

# QEMU_COMMAND="
# nsenter -t 1 -m -u --net=/host/proc/1/ns/net -i -p -- \
# /usr/bin/qemu-system-x86_64 \
#   -m ${MEMORY} -smp ${CPUS} \
#   -drive file=/host-tmp-vm/${QCOW2_IMAGE_FILE},if=virtio,cache=directsync,discard=unmap,format=qcow2,aio=native \
#   -drive file=/host-tmp-vm/${CLOUD_INIT_ISO},format=raw,if=virtio,cache=writeback,aio=threads \
#   -netdev tap,id=mynet0,ifname=${TAP_INTERFACE},script=/etc/qemu-ifup,downscript=/etc/qemu-ifdown \
#   -device virtio-net-pci,netdev=mynet0 \
#   -machine q35,accel=kvm,usb=off \
#   -cpu host \
#   -enable-kvm \
#   -nographic \
#   -nodefaults \
#   -no-reboot -no-shutdown \
#   -serial mon:stdio
# "
# log_message "DEBUG" "QEMU command: ${QEMU_COMMAND}"
# exit 0
QEMU_COMMAND="
nsenter -t 1 -m -u --net=/host/proc/1/ns/net -i -p -- \
/usr/bin/qemu-system-x86_64 \
  -m ${MEMORY} -smp ${CPUS} \
  -drive file=/host-tmp-vm/${QCOW2_IMAGE_FILE},if=virtio,cache=directsync,discard=unmap,format=qcow2,aio=native \
  -drive file=/host-tmp-vm/${CLOUD_INIT_ISO},format=raw,if=virtio,cache=writeback,aio=threads \
  -netdev tap,id=mynet0,ifname=${TAP_INTERFACE},script=/etc/qemu-ifup,downscript=/etc/qemu-ifdown \
  -device virtio-net-pci,netdev=mynet0 \
  -machine q35,accel=kvm,usb=off \
  -cpu host \
  -enable-kvm \
  -nographic \
  -nodefaults \
  -no-reboot -no-shutdown \
  -serial file:/host-tmp-vm/${NODE_NAME}-console.log
"
log_message "DEBUG" "QEMU command: ${QEMU_COMMAND}"
nohup sh -c "$QEMU_COMMAND" > /host-tmp-vm/${NODE_NAME}-stdout.log 2>&1 & echo $! > /host-tmp-vm/qemu-${NODE_NAME}.pid
BOOT_START_TIME=$(date +%s)

log_message "INFO" "VM Node started with PID $(cat /host-tmp-vm/qemu-${NODE_NAME}.pid)"
log_message "INFO" "Waiting for Kubernetes node $NODE_NAME to be ready..."
sleep 20
START_TIME=$(date +%s)
while true; do
  if kubectl get nodes "$NODE_NAME" 2>/dev/null | grep -q " Ready "; then
    log_message "INFO" "Node Ready."
    break
  fi
  if [ $(( $(date +%s) - START_TIME )) -gt $TIMEOUT ]; then
    log_message "ERROR" "Timeout."
    exit 1
  fi
  sleep 4
done

kubectl label node $NODE_NAME node-role.kubernetes.io/worker=worker
log_message "SUCCESS" "Node joined."
