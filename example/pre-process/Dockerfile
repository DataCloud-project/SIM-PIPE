# Pre-Process container image

FROM ghcr.io/colinianking/stress-ng:master as stress-ng

FROM alpine:3
RUN echo "@testing http://nl.alpinelinux.org/alpine/edge/testing" >> /etc/apk/repositories && \
    apk add --update libaio libattr libbsd libcap libcap libgcrypt jpeg judy@testing keyutils lksctp-tools libatomic zlib kmod-dev xxhash-dev && \
    rm -rf /tmp/* /var/tmp/* /var/cache/apk/* /var/cache/distfiles/*

COPY --from=stress-ng /usr/bin/stress-ng /usr/bin/stress-ng

# Create the app folder that can be mounted
RUN mkdir /app
# Create user and group named pipeline
RUN addgroup -S pipeline && adduser -S pipeline -G pipeline
RUN mkdir -p /home/pipeline && chown -R pipeline:pipeline /home/pipeline
WORKDIR /home/pipeline
USER pipeline
# Add the script to the container
COPY --chmod=0500 --chown=pipeline:pipeline ./pre-process.sh ./pre-process.sh
ENTRYPOINT [ "/home/pipeline/pre-process.sh" ]