FROM hasura/graphql-engine:v2.14.1-ce.cli-migrations-v3.debian
ENV HASURA_GRAPHQL_ENABLE_CONSOLE=false
ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/hasura-migrations
ENV HASURA_GRAPHQL_METADATA_DIR=/hasura-metadata
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
COPY migrations/ /hasura-migrations
COPY metadata/ /hasura-metadata
