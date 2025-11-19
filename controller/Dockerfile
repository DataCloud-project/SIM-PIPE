FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
# Install necessary packages for create-kube-node.sh and shutdown-kube-node.sh
RUN apk add --no-cache \
    wget \
    qemu-img \
    kubectl \
    cloud-utils-localds \
    util-linux

# Download OS images
RUN mkdir -p /app/images && \
wget -O /app/images/ubuntu-18.qcow2 https://cloud-images.ubuntu.com/bionic/current/bionic-server-cloudimg-amd64.img && \
wget -O /app/images/ubuntu-20.qcow2 https://cloud-images.ubuntu.com/focal/current/focal-server-cloudimg-amd64.img && \
wget -O /app/images/ubuntu-22.qcow2 https://cloud-images.ubuntu.com/jammy/current/jammy-server-cloudimg-amd64.img && \
wget -O /app/images/ubuntu-24.qcow2 https://cloud-images.ubuntu.com/noble/current/noble-server-cloudimg-amd64.img

RUN npm ci --no-optional
COPY src/ ./src
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-optional
RUN apk add --no-cache bash qemu-system-x86_64

COPY --from=builder /app/images /app/images
COPY --from=builder /usr/bin/qemu-img /usr/bin/qemu-img
COPY --from=builder /usr/bin/kubectl /usr/bin/kubectl
COPY --from=builder /usr/bin/cloud-localds /usr/bin/cloud-localds
COPY --from=builder /usr/bin/genisoimage /usr/bin/genisoimage
COPY --from=builder /app/dist/ ./

COPY src/emulation/scripts/shutdown-kube-node.sh /app/shutdown-kube-node.sh
COPY src/emulation/scripts/create-kube-node_qemu.sh /app/create-kube-node_qemu.sh
COPY src/emulation/scripts/create-kube-node_wsl.sh /app/create-kube-node_wsl.sh

EXPOSE 9000
CMD ["--experimental-specifier-resolution=node", "index.js"]
