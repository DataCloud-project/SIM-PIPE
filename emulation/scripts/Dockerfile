FROM node:18-alpine

# Install necessary packages to run sample_graphql_resolver.ts
RUN apk add --no-cache \
    wget \
    qemu-img \
    qemu-system-x86_64 \
    kubectl \
    cloud-utils-localds \
    bash \
    curl \
    util-linux

COPY sample_graphql_resolver.ts create_kube_node.sh ./ 
CMD ["node", "sample_graphql_resolver.ts"]