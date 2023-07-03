
FROM alpine as hello-world-build
RUN apk add --no-cache build-base
ARG TARGETARCH
ADD hello_world_${TARGETARCH}.asm /tmp/hello_world.asm
RUN as -o /tmp/hello_world.o /tmp/hello_world.asm
RUN ld -o /tmp/hello_world /tmp/hello_world.o
RUN strip /tmp/hello_world

FROM scratch
COPY --from=hello-world-build --chmod=0755 --chown=1000:1000 /tmp/hello_world /hello_world
USER 1000
CMD ["/hello_world"]