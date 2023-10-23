# Use a base image with bash and basic utilities
FROM ubuntu:latest

# Set environment variables to suppress some prompts
ENV DEBIAN_FRONTEND=noninteractive

# Install necessary packages
RUN apt-get update && apt-get install -y \
    bash \
    bc \
    && rm -rf /var/lib/apt/lists/* # Clean up caches to reduce image size

# Create a directory for our script
WORKDIR /app

# Copy the script into the image
COPY ./retrieve.sh /app/retrieve.sh

# Make the script executable
RUN chmod +x /app/retrieve.sh

# Set the default command to run the script for 10 seconds
CMD ["/app/retrieve.sh", "10"]
