#!/bin/sh

set -e # Exit immediately if a command exits with a non-zero status

# Input arguments

K3S_TOKEN_SECRET=${1:-"k3s-cluster-secret"}
NODE_NAME=${2:-"node25"}
MEMORY=${3:-4096}
CPUS=${4:-2}
TIMEOUT=${5:-600}
OS=${6:-"ubuntu-20"}
QCOW2_IMAGE_FILE=${7:-"os.qcow2"}
CLOUD_INIT_ISO=${8:-"cloud.iso"}

# Function: Log messages with timestamp
log_message() {
 echo "$(date +'%-Y-%-m-%-d %H:%M:%S') [$1] $2"
}

select_os_image() {
 log_message "INFO" "Selecting pre-downloaded OS image for $OS..."
 case "$OS" in
"ubuntu-18") cp /app/images/ubuntu-18.qcow2 "$QCOW2_IMAGE_FILE" ;;
"ubuntu-20") cp /app/images/ubuntu-20.qcow2 "$QCOW2_IMAGE_FILE" ;;
"ubuntu-22") cp /app/images/ubuntu-22.qcow2 "$QCOW2_IMAGE_FILE" ;;
"ubuntu-24") cp /app/images/ubuntu-24.qcow2 "$QCOW2_IMAGE_FILE" ;;
 *) log_message "ERROR" "Unsupported OS type: $OS"; exit 1 ;;
 esac
 qemu-img resize "$QCOW2_IMAGE_FILE" 10G

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

fetch_k3s_details

# Step 1: Create cloud-init configuration
log_message "INFO" "Generating cloud-init configuration..."
cat <<EOF > user-data
#cloud-config
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo,containerd,cni
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHkddvi88YIJiniQwd7aUlvvFm85HRO2qAGAvCRxjDwu sshkeys

chpasswd:
  list: |
    ubuntu:ubuntu
  expire: False

packages:
  - openssh-server

runcmd:
  - systemctl enable ssh
  - systemctl start ssh

  # Start K3s agent to join cluster
  - curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_URL=${K3S_SERVER_URL} K3S_TOKEN=${K3S_TOKEN} sh -
EOF

IP_ADDR=${9:-"192.168.100.11"}

cat <<EOF > network-config
version: 2
ethernets:
  ens3:
    dhcp4: no
    addresses:
      - ${IP_ADDR}/24
    gateway4: 192.168.100.1
    nameservers:
      addresses: [8.8.8.8]
EOF

cat <<EOF > meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

bash cloud-localds "$CLOUD_INIT_ISO" --network-config=network-config user-data meta-data

# Step 2: Select OS image
select_os_image
log_message "INFO" "Starting VM: $NODE_NAME..."

cp /app/os.qcow2 /host-tmp-vm/os.qcow2
cp /app/cloud.iso /host-tmp-vm/cloud.iso

# Step 3: RUN QEMU with linux bridge
log_message "INFO" "Starting QEMU for node ${NODE_NAME}"
nsenter -t 1 -m -u -n -i -p --  /usr/bin/qemu-system-x86_64 -m 4096 -smp 2 \
-drive file="/host-tmp-vm/os.qcow2",if=virtio \
-drive file="/host-tmp-vm/cloud.iso",format=raw,if=virtio \
-netdev tap,id=mynet0,ifname=tap1,script=/etc/qemu-ifup,downscript=/etc/qemu-ifdown
-device virtio-net-pci,netdev=mynet0 \
-nographic -bios /usr/share/qemu/bios-256k.bin -D /host-tmp-vm/qemu-new.log -d unimp,guest_errors