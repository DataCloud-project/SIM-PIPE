#!/bin/sh

set -e  # Exit immediately if a command exits with a non-zero status

# Input arguments
K3S_TOKEN_SECRET=${1}  
NODE_NAME=${2} 
MEMORY=${3}
CPUS=${4}
TIMEOUT=${5}
OS=${6}

# Validate input arguments
if [ $# -ne 6 ]; then
  echo "Usage: $0 <K3S_TOKEN_SECRET> <NODE_NAME> <MEMORY> <CPUS> <TIMEOUT> <OS>"
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

# Function: Generate cloud-init configuration
generate_cloud_init() {
  log_message "INFO" "Generating cloud-init configuration for $NODE_NAME..."
  cat <<EOF > user-data
#cloud-config
users:
  - name: ubuntu
    sudo: ALL=(ALL) NOPASSWD:ALL
    groups: sudo,containerd,cni
    ssh_authorized_keys:
      - ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICddu3IPxH0wQ5WIs9BEzVaabVEvrho/p4nzduq8tLee at
chpasswd:
  list: |
    ubuntu:ubuntu
  expire: False
packages:
  - openssh-server
runcmd:
  - systemctl enable ssh
  - systemctl start ssh
  - curl -sfL https://get.k3s.io | INSTALL_K3S_EXEC="agent" K3S_URL=$K3S_SERVER_URL K3S_TOKEN=$K3S_TOKEN sh -s - agent --node-name $NODE_NAME
EOF

cat <<EOF > meta-data
instance-id: $NODE_NAME
local-hostname: $NODE_NAME
EOF

}

# Function: Create VirtualMachine manifest for KubeVirt
create_vm_manifest() {
  log_message "INFO" "Creating VirtualMachine manifest for $NODE_NAME..."
  USER_DATA_B64=$(base64 -w 0 user-data)

cat <<EOF > ${NODE_NAME}-vm.yaml
apiVersion: kubevirt.io/v1
kind: VirtualMachine
metadata:
  name: ${NODE_NAME}
spec:
  runStrategy: Always
  template:
    metadata:
      labels:
        kubevirt.io/domain: ${NODE_NAME}
    spec:
      domain:
        resources:
          requests:
            memory: 2Gi  # Fixed indentation (2 spaces)
            cpu: "2"
        devices:
          disks:
          - name: containerdisk
            disk:
              bus: virtio  # Proper key:value formatting
          - name: cloudinitdisk
            disk:
              bus: virtio
        machine:
          type: ""  # Empty string requires quotes
      volumes:
      - name: containerdisk
        containerDisk:
          image: quay.io/containerdisks/ubuntu:22.04
      - name: cloudinitdisk
        cloudInitNoCloud:
          userDataBase64: "${USER_DATA_B64}"

EOF

}

# Function: Deploy the VirtualMachine using kubectl and wait for readiness
deploy_vm() {
  log_message "INFO" "Deploying VirtualMachine $NODE_NAME..."
  exit 0
  kubectl apply -f ${NODE_NAME}-vm.yaml

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

# Main execution flow starts here.
fetch_k3s_details

generate_cloud_init

create_vm_manifest

deploy_vm

log_message "SUCCESS" "Node $NODE_NAME successfully added to the cluster."
