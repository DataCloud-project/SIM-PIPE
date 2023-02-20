# Build stage
FROM rust:1.67.0-alpine AS build
RUN rustup target add x86_64-unknown-linux-musl
RUN apk add --no-cache musl-dev git

WORKDIR /app

# Copy the project files and build the project
COPY Cargo.toml Cargo.lock ./
COPY src ./src
RUN cargo build --release --target x86_64-unknown-linux-musl --config net.git-fetch-with-cli=true
RUN strip target/x86_64-unknown-linux-musl/release/simpipe-preflight

# Run stage
FROM alpine
RUN apk add --no-cache openssl-dev
WORKDIR /app

# Create user 1000
RUN adduser \
  --disabled-password \
  --gecos "" \
  --home "/nonexistent" \
  --no-create-home \
  --shell "/sbin/nologin" \
  --uid "1000" \
  "1000"
# Note that we keep running on root at initialization to set the folder permission correctly

# Copy the binary from the build stage
COPY --from=build /app/target/x86_64-unknown-linux-musl/release/simpipe-preflight /app/simpipe-preflight
ENV UID 1000
# Set the environment variables and run the binary
CMD ["/app/simpipe-preflight"]
