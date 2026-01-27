#!/bin/sh

set -e

# Input arguments
NODE_NAME=${1:-"node27"}
MEMORY=${2:-4096}
CPUS=${3:-2}
OS=${4:-"ubuntu-20"}
K3S_TOKEN_SECRET=${5:-"k3s-cluster-secret"}
TIMEOUT=${6:-1200}

# File Paths
QCOW2_IMAGE_FILE="${NODE_NAME}-os.qcow2"
CLOUD_INIT_ISO="${NODE_NAME}-cloud.iso"
TAP_INTERFACE="tap-${NODE_NAME}"

log_message() { echo "$(date +'%-Y-%-m-%-d %H:%M:%S') [$1] $2"; }

# Networking: derive IP from NODE_NAME to allow multiple nodes without collisions
BASE_PREFIX="172.30.0"

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

# Ensure WSL host bridge, NAT, and qemu-ifup/ifdown are configured.
# This script is idempotent and safe to run multiple times.
if [ -x /app/setup-wsl-host.sh ]; then
  log_message "INFO" "Running WSL host network setup script..."
  /app/setup-wsl-host.sh || log_message "ERROR" "setup-wsl-host.sh failed"
fi

select_os_image() {
  log_message "INFO" "Selecting pre-downloaded OS image for $OS..."
  # (Assuming your existing image paths are correct)
  case "$OS" in
    "ubuntu-18") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-18.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
    "ubuntu-20") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-20.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
    "ubuntu-22") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-22.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
    "ubuntu-24") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-24.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
    *) log_message "ERROR" "Unsupported OS type: $OS"; exit 1 ;;
  esac
}

fetch_k3s_details() {
  log_message "INFO" "Fetching Kubernetes cluster details..."
  K3S_SERVER_IP=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.K3S_SERVER_IP}' | base64 -d)
  K3S_TOKEN=$(kubectl get secret "$K3S_TOKEN_SECRET" -o jsonpath='{.data.token}' | base64 -d)
  K3S_SERVER_URL="https://${K3S_SERVER_IP}:6443"
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
  - systemctl enable docker
  - systemctl start docker
  - bash -c 'until systemctl is-active --quiet docker; do sleep 1; done'

  # Remove incorrect default route via lo (workaround for netplan bug)
  - bash -c 'ip route del default via 172.30.0.1 dev lo || true'

  # Start K3s agent (let k3s/flannel pick the interface/IP based on the
  - curl -sfL https://get.k3s.io | INSTALL_K3S_VERSION=v1.33.4+k3s1 INSTALL_K3S_EXEC="agent --docker" K3S_URL=${K3S_SERVER_URL} K3S_TOKEN=${K3S_TOKEN} sh - 
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
      gateway4: 172.30.0.1
      addresses:
        - ${IP_ADDR}/24
      nameservers:
        addresses:
          - 8.8.8.8
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
# nohup sh -c "$QEMU_COMMAND" > /host-tmp-vm/${NODE_NAME}-stdout.log 2>&1 &
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