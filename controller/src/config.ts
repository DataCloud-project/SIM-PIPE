import { config as loadDotenv } from 'dotenv';

loadDotenv();

export const remote = process.argv[2] ? process.argv[2] === 'remote' : true;

export const user = process.env.USER ?? 'local';

// Docker client configuration
export const dockerHost = process.env.SANDBOX_IP ?? process.env.DOCKER_HOST ?? 'localhost';
export const dockerCaCertPath = process.env.SANDBOX_CA_CERT ?? process.env.DOCKER_TLS_CA_CERT ?? '';
export const dockerTlsCertPath = process.env.SANDBOX_TLS_CERT ?? process.env.DOCKER_TLS_CERT ?? '';
export const dockerTlsKeyPath = process.env.SANDBOX_TLS_KEY ?? process.env.DOCKER_TLS_KEY ?? '';
export const dockerProtocol = (process.env.SANDBOX_TLS_VERIFY ?? process.env.DOCKER_TLS_VERIFY)
  ? 'https' : 'http';
export const dockerPort = process.env.SANDBOX_PORT ?? process.env.DOCKER_PORT ?? (
  dockerProtocol === 'https' ? 2376 : 2375
);
export const dockerSocketPath = process.env.DOCKER_SOCKET ?? '/var/run/docker.sock';

// User authentication
export const keycloakRealmEndpoint = process.env.KEYCLOAK_REALM_ENDPOINT
  ?? 'https://datacloud-auth.euprojects.net/auth/realms/user-authentication';

// eslint-disable-next-line unicorn/prevent-abbreviations
export const jwtDevMode = process.env.JWT_DEV_MODE === 'true';
if (jwtDevMode && keycloakRealmEndpoint !== 'disabled') {
  throw new Error('JWT_DEV_MODE is enabled but KEYCLOAK_REALM_ENDPOINT is not set to "disabled"');
}

// How long the keycloak public keys are cached
export const authenticationExpiryTimeout = process.env.AUTHENTICATION_EXPIRY_TIMEOUT
  ? Number.parseInt(process.env.AUTHENTICATION_EXPIRY_TIMEOUT, 10) : 3600;

// Hasura

export const hasuraEndpoint = process.env.HASURA ?? 'http://localhost:8080/v1/graphql';
export const hasuraAdminSecret = process.env.HASURA_ADMIN_SECRET;
// In case we want a hardcoded key, we can use the environment variable
// Please note that the keys will not be automatically rotated
export const hasuraControllerJwtPrivateKey = process.env.HASURA_CONTROLLER_JWT_PRIVATE_KEY;

// Minio
export const minioAccessKey = process.env.MINIO_ACCESS_KEY;
export const minioSecretKey = process.env.MINIO_SECRET_KEY;
export const minioEndpoint = process.env.MINIO_ENDPOINT ?? 'localhost';
export const minioPort = process.env.MINIO_PORT
  ? Number.parseInt(process.env.MINIO_PORT, 10) : undefined;
export const minioUseSSL = !!process.env.MINIO_USE_SSL;
export const minioBucketName = process.env.MINIO_BUCKET_NAME ?? 'simpipe2';

export const minioApiAccessKey = process.env.MINIO_API_ACCESS_KEY ?? minioAccessKey;
export const minioApiSecretKey = process.env.MINIO_API_SECRET_KEY ?? minioSecretKey;
export const minioApiEndpoint = process.env.MINIO_API_ENDPOINT ?? minioEndpoint;
export const minioApiPort = process.env.MINIO_API_PORT
  ? Number.parseInt(process.env.MINIO_API_PORT, 10) : undefined;
export const minioApiUseSSL = process.env.MINIO_API_USE_SSL === undefined
  ? minioUseSSL : !!process.env.MINIO_API_USE_SSL;
export const minioWebhookEndpoint = process.env.MINIO_WEBHOOK_ENDPOINT ?? 'http://controller:9000/minio/webhook';

// Runner
export const runnerContainerStopTimeout = process.env.RUNNER_CONTAINER_STOP_TIMEOUT
  ? Number.parseInt(process.env.RUNNER_CONTAINER_STOP_TIMEOUT, 10) : 5;
