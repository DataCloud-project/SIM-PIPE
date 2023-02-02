FROM hasura/graphql-engine:v2.17.1-ce.cli-migrations-v3
ENV HASURA_GRAPHQL_ENABLE_CONSOLE=false
ENV HASURA_GRAPHQL_MIGRATIONS_DIR=/hasura-migrations
ENV HASURA_GRAPHQL_METADATA_DIR=/hasura-metadata
ENV HASURA_GRAPHQL_ENABLE_TELEMETRY=false
ENV HASURA_GRAPHQL_ENABLED_LOG_TYPES="startup, http-log, webhook-log, websocket-log, query-log"
ENV HASURA_GRAPHQL_UNAUTHORIZED_ROLE=anonymous
ENV HASURA_GRAPHQL_ENABLE_REMOTE_SCHEMA_PERMISSIONS=true
ENV HASURA_GRAPHQL_EXPERIMENTAL_FEATURES=naming_convention
COPY migrations/ /hasura-migrations
COPY metadata/ /hasura-metadata
