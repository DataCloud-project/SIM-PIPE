#!/bin/bash

# Stop the running VM
echo "Stopping the VM..."
kill -9 $(pgrep -f qemu-system-x86_64)

# Clean up generated files
echo "Deleting generated files (REMOVED FOR TESTING)..."
# rm -f user-data meta-data cloud-init.iso ubuntu-node.qcow2 

# remove kube node from the cluster
echo "Removing new node from the cluster..."
kubectl delete deployment --all
kubectl delete node kube-node
echo "Cleanup complete."
kubectl get all
kubectl get nodes
