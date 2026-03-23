FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
# Install necessary packages for create-kube-node.sh and shutdown-kube-node.sh
RUN apk add --no-cache \
    qemu-img \
    kubectl \
    cloud-utils-localds \
    util-linux

RUN npm ci --no-optional
COPY src/ ./src
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-optional
RUN apk add --no-cache bash qemu-system-x86_64 iproute2 iptables wget ca-certificates

COPY --from=builder /usr/bin/qemu-img /usr/bin/qemu-img
COPY --from=builder /usr/bin/kubectl /usr/bin/kubectl
COPY --from=builder /usr/bin/cloud-localds /usr/bin/cloud-localds
COPY --from=builder /usr/bin/genisoimage /usr/bin/genisoimage
COPY --from=builder /app/dist/ ./

COPY src/emulation/scripts/shutdown-kube-node.sh /app/shutdown-kube-node.sh
COPY src/emulation/scripts/create-kube-node_qemu.sh /app/create-kube-node_qemu.sh
COPY src/emulation/scripts/create-kube-node_wsl.sh /app/create-kube-node_wsl.sh
COPY src/emulation/scripts/setup-wsl-host.sh /app/setup-wsl-host.sh
COPY src/emulation/scripts/setup-debian-host.sh /app/setup-debian-host.sh

# Ensure emulation helper scripts are executable
RUN chmod +x \
    /app/shutdown-kube-node.sh \
    /app/create-kube-node_qemu.sh \
    /app/create-kube-node_wsl.sh \
    /app/setup-wsl-host.sh \
    /app/setup-debian-host.sh

EXPOSE 9000
CMD ["--experimental-specifier-resolution=node", "index.js"]
