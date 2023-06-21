# Build Stage
FROM golang:1.20 as builder

# Set environment variable to disable cgo which gives us a static binary
ENV CGO_ENABLED=0 \
    GOOS=linux

# Set the Current Working Directory inside the builder container
WORKDIR /build

# Copy go mod and sum files and download the dependencies in one fell swoop
COPY go.mod go.sum ./
RUN go mod download

# Copy the source code into the container
COPY . .

# Build the Go app with the -ldflags option to strip debug information, thereby reducing binary size
RUN go build -ldflags="-extldflags \"-static\" -s -w" -o sim-pipe-cadvisor-bridge .

# Create a non-root user 'simpipe' to run the Go application in the final stage
RUN useradd -u 1000 simpipe

# Squash image
FROM scratch as squasher

# Import user and group files from the builder stage to allow running as non-root
COPY --from=builder /etc/passwd /etc/passwd
COPY --from=builder /etc/group /etc/group

# Copy the binary from builder stage
COPY --from=builder /build/sim-pipe-cadvisor-bridge /

# Final Stage
FROM scratch

# Copy everything from the squasher stage
COPY --from=squasher / /

# Expose port 2112 to allow communication to/from server
EXPOSE 2112

# Switch to non-root user for enhanced security
USER simpipe

# Set the binary as the entry point of the container
ENTRYPOINT ["/sim-pipe-cadvisor-bridge"]
