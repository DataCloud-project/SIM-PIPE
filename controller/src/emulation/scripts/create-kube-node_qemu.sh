#!/bin/sh

set -e # Exit immediately if a command exits with a non-zero status

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

# Function: Log messages with timestamp
log_message() {
 echo "$(date +'%-Y-%-m-%-d %H:%M:%S') [$1] $2"
}

select_os_image() {
 log_message "INFO" "Selecting pre-downloaded OS image for $OS..."
 case "$OS" in
"ubuntu-18") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-18.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
"ubuntu-20") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-20.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
"ubuntu-22") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-22.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;
"ubuntu-24") qemu-img create -f qcow2 -F qcow2 -b /app/images/ubuntu-24.qcow2 "${QCOW2_IMAGE_FILE}" 10G ;;

*) log_message "ERROR" "Unsupported OS type: $OS"; exit 1 ;;
esac
}

# Function: Fetch K3S cluster details
fetch_k3s_details() {
  # use curl ifconfig.me for ip
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

IP_ADDR=${9:-"192.168.100.11"}

NODE_NUM=$(echo "$NODE_NAME" | grep -o '[0-9]*$')
if [ -n "$NODE_NUM" ]; then
  IP_ADDR="192.168.100.${NODE_NUM}"
  log_message "DEBUG" "Node name has numeric suffix → using IP ${IP_ADDR}"
else
  HASH_NUM=$(echo -n "$NODE_NAME" | cksum | awk '{print $1 % 200 + 20}')
  IP_ADDR="192.168.100.${HASH_NUM}"
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
      gateway4: 192.168.100.1
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
