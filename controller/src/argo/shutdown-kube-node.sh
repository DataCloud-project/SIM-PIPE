#!/bin/sh

set -e

# Check if NODE_NAME is provided
if [ -z "$1" ]; then
  echo "Error: NODE_NAME not provided. Usage: $0 <node-name>"
  exit 1
fi

NODE_NAME="$1"
PID_FILE="/host-tmp-vm/qemu-${NODE_NAME}.pid"
QCOW2_IMAGE_FILE="os-${NODE_NAME}.qcow2"
CLOUD_INIT_ISO="cloud-${NODE_NAME}.iso"
TAP_INTERFACE="tap-${NODE_NAME}"

echo "Stopping the VM for $NODE_NAME..."
VM_WRAPPER_PID=$(cat "$PID_FILE")

kill -9 "$VM_WRAPPER_PID"

rm -f user-data meta-data network-config "$CLOUD_INIT_ISO" "$QCOW2_IMAGE_FILE"

kubectl drain "$NODE_NAME" --ignore-daemonsets --delete-emptydir-data --force || true

kubectl delete node "$NODE_NAME" || true

# rm -f "/tmp/qemu-${NODE_NAME}.pid"
echo "Cleanup complete for $NODE_NAME"
