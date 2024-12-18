#!/bin/bash

# Stop the running VM
echo "Stopping the VM..."
kill -9 $(pgrep -f qemu-system-x86_64)

# Clean up generated files; TODO parameterize this 
echo "Deleting generated files..."
rm -f user-data meta-data cloud-init.iso ubuntu-node.qcow2 

# remove kube node from the cluster
echo "Removing new node from the cluster..."
kubectl delete node kube-node
echo "Cleanup complete."
