#!/bin/sh

# Stop the running VM
echo "Stopping the VM..."
VM_PID=$(pgrep -f qemu-system-x86_64)
if [ -n "$VM_PID" ]; then
  kill -9 "$VM_PID"
else
  echo "No VM process found."
fi

# Clean up generated files
echo "Deleting generated files..."
rm -f user-data meta-data cloud-init.iso os.qcow2

# Remove kube node from the cluster
echo "Removing new node from the cluster..."
kubectl delete deployment --all
kubectl delete node kube-node
echo "Cleanup complete"