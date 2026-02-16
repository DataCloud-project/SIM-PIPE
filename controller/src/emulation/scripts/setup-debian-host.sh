#!/usr/bin/env bash
set -euo pipefail

# Bridge and NAT configuration for running QEMU-based kube nodes on a Debian host.
# This script is idempotent and safe to run multiple times.

# Defaults create a dedicated SIMPIPE bridge and network, separate from any
# existing host bridges:
#   - Bridge name: simpipe-bridge
#   - Guest IPs:   172.31.0.X
#   - Gateway:     172.31.0.1 (bridge IP)
#   - Network:     172.31.0.0/24

BR_IF="${DEBIAN_BR_IF:-simpipe-bridge}"
BR_CIDR="${DEBIAN_BR_CIDR:-172.31.0.1/24}"
BR_NET="${DEBIAN_BR_NET:-172.31.0.0/24}"
WAN_IF="${DEBIAN_WAN_IF:-}"

# If running inside a container with the host network namespace bind-mounted
# at /host/proc/1/ns/net, mirror the nsenter pattern used by QEMU.
NSENTER=""
if [ -e /host/proc/1/ns/net ]; then
  NSENTER="nsenter --net=/host/proc/1/ns/net --"
fi

# Auto-detect WAN_IF if not provided (uses default route in the
# same namespace where we will apply iptables rules).
if [ -z "${WAN_IF}" ]; then
  DETECTED_IF=$($NSENTER ip route show default 2>/dev/null | awk '/default/ {print $5; exit}' || true)
  if [ -n "${DETECTED_IF}" ]; then
    WAN_IF="${DETECTED_IF}"
  else
    WAN_IF="eth0"  # conservative fallback
  fi
fi

echo "[*] Creating/Configuring bridge ${BR_IF} on ${BR_CIDR}"

# Create bridge if missing
if ! $NSENTER ip link show "${BR_IF}" >/dev/null 2>&1; then
  $NSENTER ip link add "${BR_IF}" type bridge
fi

# Assign IP if not already present
if ! $NSENTER ip addr show dev "${BR_IF}" | grep -q " ${BR_CIDR%/*}"; then
  # Only add the address if missing; avoid flushing to preserve existing consumers.
  $NSENTER ip addr add "${BR_CIDR}" dev "${BR_IF}"
fi

$NSENTER ip link set "${BR_IF}" up

echo "[*] Enabling IPv4 forwarding"
$NSENTER sysctl -w net.ipv4.ip_forward=1 >/dev/null

echo "[*] WAN_IF detected as ${WAN_IF}"

echo "[*] Adding iptables FORWARD rules (simpipe-bridge -> ${WAN_IF})"
$NSENTER iptables -C FORWARD -i "${BR_IF}" -o "${WAN_IF}" -j ACCEPT 2>/dev/null || \
  $NSENTER iptables -A FORWARD -i "${BR_IF}" -o "${WAN_IF}" -j ACCEPT
$NSENTER iptables -C FORWARD -i "${WAN_IF}" -o "${BR_IF}" -m state --state RELATED,ESTABLISHED -j ACCEPT 2>/dev/null || \
  $NSENTER iptables -A FORWARD -i "${WAN_IF}" -o "${BR_IF}" -m state --state RELATED,ESTABLISHED -j ACCEPT

echo "[*] Adding iptables MASQUERADE rule for ${BR_NET} via ${WAN_IF}"
$NSENTER iptables -t nat -C POSTROUTING -s "${BR_NET}" -o "${WAN_IF}" -j MASQUERADE 2>/dev/null || \
  $NSENTER iptables -t nat -A POSTROUTING -s "${BR_NET}" -o "${WAN_IF}" -j MASQUERADE

echo "[*] Writing /etc/qemu-ifup"
cat >/etc/qemu-ifup <<EOF
#!/bin/sh
set -e
IFACE="\$1"
ip link set "\$IFACE" up
ip link set "\$IFACE" master ${BR_IF}
EOF
chmod +x /etc/qemu-ifup

echo "[*] Writing /etc/qemu-ifdown"
cat >/etc/qemu-ifdown <<EOF
#!/bin/sh
set -e
IFACE="\$1"
ip link set "\$IFACE" down || true
# ip link delete "\$IFACE" 2>/dev/null || true  # optional
EOF
chmod +x /etc/qemu-ifdown

echo "[*] Done. Current bridge status:"
$NSENTER ip addr show "${BR_IF}"
