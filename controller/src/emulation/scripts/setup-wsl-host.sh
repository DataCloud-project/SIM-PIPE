#!/usr/bin/env bash
set -euo pipefail

# Read WSL/QEMU networking from environment or default values.
BR_IF="${WSL_BR_IF:-simpipe-bridge}"
BR_CIDR="${WSL_BR_CIDR:-172.30.0.1/24}"
BR_NET="${WSL_BR_NET:-172.30.0.0/24}"
WAN_IF="${WSL_WAN_IF:-eth0}"

# Run all network operations in the same host network namespace
# that QEMU uses (mounted at /host/proc/1/ns/net). If that mount is
# not present, fall back to the current namespace.
NSENTER=""
if [ -e /host/proc/1/ns/net ]; then
  # Mirror the QEMU_COMMAND pattern: explicitly enter the host
  # network namespace via the bind-mounted ns file.
  NSENTER="nsenter --net=/host/proc/1/ns/net --"
fi

# Prefer legacy when available; allow override via IPTABLES_BIN.
if [ -z "${IPTABLES_BIN:-}" ] && command -v iptables-legacy >/dev/null 2>&1; then
  IPTABLES_BIN="iptables-legacy"
fi
: "${IPTABLES_BIN:=iptables}"

echo "[*] Using iptables binary: ${IPTABLES_BIN}"

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

echo "[*] Adding iptables FORWARD rules"
$NSENTER ${IPTABLES_BIN} -C FORWARD -i "${BR_IF}" -o "${WAN_IF}" -j ACCEPT 2>/dev/null \
  || $NSENTER ${IPTABLES_BIN} -A FORWARD -i "${BR_IF}" -o "${WAN_IF}" -j ACCEPT
$NSENTER ${IPTABLES_BIN} -C FORWARD -i "${WAN_IF}" -o "${BR_IF}" -j ACCEPT 2>/dev/null \
  || $NSENTER ${IPTABLES_BIN} -A FORWARD -i "${WAN_IF}" -o "${BR_IF}" -j ACCEPT

echo "[*] Adding iptables MASQUERADE rule for ${BR_NET}"
$NSENTER ${IPTABLES_BIN} -t nat -C POSTROUTING -s "${BR_NET}" -o "${WAN_IF}" -j MASQUERADE 2>/dev/null \
  || $NSENTER ${IPTABLES_BIN} -t nat -A POSTROUTING -s "${BR_NET}" -o "${WAN_IF}" -j MASQUERADE

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