# Use Ubuntu as the base image
FROM ubuntu:latest

# Set up environment and non-interactive flag for apt-get
ENV DEBIAN_FRONTEND=noninteractive

# Update and install necessary utilities
RUN apt-get update && apt-get install -y \
    bash \
    bc \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory in the docker container
WORKDIR /app

# Create an /out/ directory in the container to store outputs
RUN mkdir /out

# Copy the notify.sh script into the container
COPY notify.sh /app/

# Make the script executable
RUN chmod +x /app/notify.sh

# Specify the default command to run the third application when the container starts
CMD ["/app/notify.sh"]
