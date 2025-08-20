#!/bin/sh

# Check if NODE_NAME is provided
if [ -z "$1" ]; then
  echo "Error: NODE_NAME not provided. Usage: $0 <node-name>"
  exit 1
fi

NODE_NAME="$1"

# Stop the running VM
echo "Stopping the VM for $NODE_NAME..."
VM_PID=$(pgrep -f "qemu-system-x86_64.*$NODE_NAME")
if [ -n "$VM_PID" ]; then
  kill -9 "$VM_PID"
  echo "VM stopped."
else
  echo "No VM process found for $NODE_NAME."
fi

# Clean up generated files
echo "Deleting generated files..."
rm -f user-data meta-data cloud-init.iso os.qcow2

# Remove all deployments from the node
echo "Draining deployments from node $NODE_NAME..."
kubectl drain "$NODE_NAME" --ignore-daemonsets --delete-emptydir-data --force

# Remove kube node from the cluster
echo "Removing node $NODE_NAME from the cluster..."
kubectl delete node "$NODE_NAME"

echo "Cleanup complete for $NODE_NAME"