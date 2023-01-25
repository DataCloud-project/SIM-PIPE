#FROM gcr.io/cadvisor/cadvisor:v0.47.0 as cadvisor
FROM docker:20.10.22-dind as dind
FROM alpine:3.17 as alpine
# Install tini to manage both processes correctly
RUN apk add --no-cache tini

FROM dind
#COPY --from=cadvisor /usr/bin/cadvisor /usr/bin/cadvisor
COPY --from=alpine /sbin/tini /usr/bin/tini
COPY --chown=root:root --chmod=0755 start.sh /usr/bin/start.sh
COPY --chown=root:root --chmod=0755 cadvisor /usr/bin/cadvisor

# Expose the cadvisor port
EXPOSE 8080
# Expose the docker port
EXPOSE 2376

ENTRYPOINT [ "/usr/bin/tini", "--" ]
CMD ["start.sh"]