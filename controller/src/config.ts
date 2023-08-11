import { config as loadDotenv } from 'dotenv';

loadDotenv();

export const jwtUser = process.env.JWT_USER ?? 'local';

// User authentication
export const oauth2IssuerEndpoint = process.env.OAUTH2_ISSUER_ENDPOINT;

// How long the keycloak public keys are cached
export const authenticationExpiryTimeout = process.env.AUTHENTICATION_EXPIRY_TIMEOUT
  ? Number.parseInt(process.env.AUTHENTICATION_EXPIRY_TIMEOUT, 10) : 3600;

// Minio
export const minioAccessKey = process.env.MINIO_ACCESS_KEY;
export const minioSecretKey = process.env.MINIO_SECRET_KEY;
export const minioBucketName = process.env.MINIO_BUCKET_NAME ?? 'artifacts';
export const minioRegion = process.env.MINIO_REGION ?? 'no-region';
export const minioUrl = process.env.MINIO_URL ?? 'http://localhost:8085';

// Argo client
export const argoClientEndpoint = process.env.ARGO_CLIENT_ENDPOINT ?? 'http://localhost:8084/';

// Kubernetes client
export const kubernetesNamespace = process.env.KUBERNETES_NAMESPACE ?? 'default';

// Prometheus endpoint
export const prometheusServerUrl = process.env.PROMETHEUS_SERVER_URL ?? 'http://localhost:8086';
