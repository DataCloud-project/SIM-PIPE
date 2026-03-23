#!/bin/sh

set +e

# Check if NODE_NAME is provided
if [ -z "$1" ]; then
  echo "Error: NODE_NAME not provided. Usage: $0 <node-name>"
  exit 1
fi

NODE_NAME="$1"
PID_FILE="/host-tmp-vm/qemu-${NODE_NAME}.pid"
QCOW2_IMAGE_FILE="${NODE_NAME}-os.qcow2"
CLOUD_INIT_ISO="${NODE_NAME}-cloud.iso"
TAP_INTERFACE="tap-${NODE_NAME}"

# If available, run process inspection/kill in the host namespaces
# (same place QEMU is visible when using nsenter for networking).
NSENTER=""
if command -v nsenter >/dev/null 2>&1; then
  # Prefer targeting PID 1's namespaces, which works on this platform
  if nsenter -t 1 -p -m -u -n -i -- true 2>/dev/null; then
    NSENTER="nsenter -t 1 -p -m -u -n -i --"
    echo "[shutdown-kube-node] Using nsenter prefix: $NSENTER"
  else
    echo "[shutdown-kube-node] nsenter present but cannot join PID 1 namespaces; falling back to container namespace"
  fi
else
  echo "[shutdown-kube-node] nsenter not available; using container namespace for ps/kill"
fi

echo "Stopping the VM for $NODE_NAME..."
if [ -f "$PID_FILE" ]; then
  VM_WRAPPER_PID=$(cat "$PID_FILE" 2>/dev/null || true)
  if [ -n "$VM_WRAPPER_PID" ]; then
    echo "Killing VM wrapper PID $VM_WRAPPER_PID"
    kill -9 "$VM_WRAPPER_PID" 2>/dev/null || true
  else
    echo "PID file $PID_FILE is empty, skipping wrapper kill"
  fi
else
  echo "PID file $PID_FILE not found, falling back to process search"
fi

# Kill any qemu-system-x86_64 processes associated with this node name
PIDS="$($NSENTER ps -eo pid,args 2>/dev/null | grep qemu-system-x86_64 | grep "$NODE_NAME" | grep -v grep | awk '{print $1}')"
if [ -n "$PIDS" ]; then
  echo "Killing qemu-system-x86_64 PIDs for $NODE_NAME: $PIDS"
  for PID in $PIDS; do
    $NSENTER kill -9 "$PID" 2>/dev/null || true
  done
fi

echo "DEBUG: attempting deletion"
for f in /host-tmp-vm/*$NODE_NAME*; do
    rm -v -f "$f" || echo "Cannot delete $f"
done

rm -f user-data meta-data network-config

kubectl drain "$NODE_NAME" --ignore-daemonsets --delete-emptydir-data --force || true

kubectl delete node "$NODE_NAME" || true
# rm -f "/tmp/qemu-${NODE_NAME}.pid"
echo "Cleanup complete for $NODE_NAME"
