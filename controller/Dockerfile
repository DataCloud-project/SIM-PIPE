FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
# Install necessary packages for create-kube-node.sh and shutdown-kube-node.sh
RUN apk add --no-cache \
    wget \
    qemu-img \
    qemu-system-x86_64 \
    kubectl \
    cloud-utils-localds \
    curl \
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
# Install runtime dependencies
RUN apk add --no-cache bash qemu-system-x86_64

# Copy the script and necessary binaries
# Copy pre-downloaded OS images
COPY --from=builder /app/images /app/images
COPY --from=builder /usr/bin/qemu-img /usr/bin/qemu-img
COPY --from=builder /usr/bin/qemu-system-x86_64 /usr/bin/qemu-system-x86_64
COPY --from=builder /usr/bin/kubectl /usr/bin/kubectl
COPY --from=builder /usr/bin/cloud-localds /usr/bin/cloud-localds
COPY --from=builder /usr/bin/genisoimage /usr/bin/genisoimage
COPY --from=builder /usr/share/qemu/ /usr/share/qemu/
COPY --from=builder /usr/bin/curl /usr/bin/curl
COPY --from=builder /app/dist/ ./
COPY src/argo/create-kube-node.sh /app/create-kube-node.sh
COPY src/argo/shutdown-kube-node.sh /app/shutdown-kube-node.sh

COPY src/argo/create-kube-node_qemu.sh /app/create-kube-node_qemu.sh

EXPOSE 9000
CMD ["--experimental-specifier-resolution=node", "index.js"]
