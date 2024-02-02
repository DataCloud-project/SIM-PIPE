
# Use an official Python runtime as a parent image
FROM python:3.11-slim-buster

# Variables
ENV KWOK_REPO=kubernetes-sigs/kwok
ENV KWOK_LATEST_RELEASE=v0.0.0

# Set the working directory to /app
WORKDIR /app

# Copy the current directory contents into the container at /app
COPY . /app

# Install necessary packages
RUN apt-get update && \
    apt-get install -y curl gzip ca-certificates apt-transport-https && \
    curl -sSL https://get.docker.com | sh && \
    curl -sSL -o /usr/local/bin/kind "https://kind.sigs.k8s.io/dl/v0.20.0/kind-linux-amd64" && \
    chmod +x /usr/local/bin/kind && \
    curl -sLO "https://github.com/argoproj/argo-workflows/releases/download/v3.4.13/argo-linux-amd64.gz" && \
    gzip -d argo-linux-amd64.gz && \
    mv ./argo-linux-amd64 /usr/local/bin/argo && \
    chmod +x /usr/local/bin/argo && \
    curl -sSL -o /usr/local/bin/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.22.0/bin/linux/amd64/kubectl" && \
    chmod +x /usr/local/bin/kubectl && \
    curl -sSL -o /usr/local/bin/kwokctl "https://github.com/kubernetes-sigs/kwok/releases/download/v0.4.0/kwokctl-linux-amd64" && \
    chmod +x /usr/local/bin/kwokctl && \
    curl -sSL -o /usr/local/bin/kwok "https://github.com/kubernetes-sigs/kwok/releases/download/v0.4.0/kwok-linux-amd64" && \    
    chmod +x /usr/local/bin/kwok && \
    pip install poetry && \
    poetry install && \
    rm -rf /var/lib/apt/lists/*

CMD [ "poetry", "run", "python", "run_simulation.py", "-v"]
