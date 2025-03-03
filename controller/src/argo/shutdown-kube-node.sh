#!/bin/sh

# Check if NODE_NAME is provided
if [ -z "$1" ]; then
  echo "Error: NODE_NAME not provided. Usage: $0 <node-name>"
  exit 1
fi

NODE_NAME="$1"
PID_FILE="/tmp/qemu-$NODE_NAME.pid"

# Stop the running VM
echo "Stopping the VM for $NODE_NAME..."
if [ -f "$PID_FILE" ]; then
  VM_PID=$(cat "$PID_FILE")
  if ps -p "$VM_PID" > /dev/null 2>&1; then
    kill -9 "$VM_PID"
    echo "VM stopped."
    rm -f "$PID_FILE"
  else
    echo "No running VM process found for PID $VM_PID."
    rm -f "$PID_FILE"
  fi
else
  echo "No PID file found for $NODE_NAME."
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
