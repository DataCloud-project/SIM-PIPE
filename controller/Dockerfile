FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
# Install necessary packages for create_kube_node.sh
RUN apk add --no-cache \
    wget \
    qemu-img \
    qemu-system-x86_64 \
    kubectl \
    cloud-utils-localds \
    curl \
    util-linux

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
COPY --from=builder /usr/bin/qemu-img /usr/bin/qemu-img
COPY --from=builder /usr/bin/qemu-system-x86_64 /usr/bin/qemu-system-x86_64
COPY --from=builder /usr/bin/kubectl /usr/bin/kubectl
COPY --from=builder /usr/bin/cloud-localds /usr/bin/cloud-localds
COPY --from=builder /usr/bin/genisoimage /usr/bin/genisoimage
COPY --from=builder /usr/share/qemu/ /usr/share/qemu/
COPY --from=builder /usr/bin/curl /usr/bin/curl
COPY --from=builder /app/dist/ ./
COPY src/argo/create-kube-node.sh /app/create-kube-node.sh

EXPOSE 9000
CMD ["--experimental-specifier-resolution=node", "index.js"]
