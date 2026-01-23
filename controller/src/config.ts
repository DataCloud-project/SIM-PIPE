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
export const minioPublicUrl = process.env.MINIO_PUBLIC_URL ?? 'http://localhost:8085';
export const minioInternalUrl = process.env.MINIO_INTERNAL_URL ?? minioPublicUrl;

// Argo client
export const argoClientEndpoint = process.env.ARGO_CLIENT_ENDPOINT ?? 'http://localhost:8084/';

// Kubernetes client
export const kubernetesNamespace = process.env.KUBERNETES_NAMESPACE ?? 'default';

// Prometheus endpoint
export const prometheusServerUrl = process.env.PROMETHEUS_SERVER_URL ?? 'http://localhost:8086';

// Carbontracker endpoint
// For Kubernetes cluster deployment, use internal service DNS
// For local development, use localhost
export const carbontrackerEndpoint = process.env.CARBONTRACKER_ENDPOINT ?? 'http://localhost:8000';

// Moose API endpoint and api keys
export const mooseApiEndpoint:string = process.env.MOOSE_API_ENDPOINT ?? 'https://moose.zooverse.dev';
export const mooseApiKey:string = process.env.MOOSE_API_KEY ?? '';
export const mooseApiKeyPAID:string = process.env.MOOSE_PAID_API_KEY ?? '';
export const openRouterApiKey:string = process.env.OPENROUTER_API_KEY ?? '';
export const openRouterApiKeyPAID:string = process.env.OPENROUTER_API_KEY_PAID ?? '';
export const useOpenRouterPaidAPI = false;

// Moose DPV LLM configuration
export const mooseLlmProvider = 'openrouter';
export const mooseLlmModel = 'gpt-oss-120b';
export const mooseDpvSchema = 'dpv';
