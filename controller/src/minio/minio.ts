import { Client as MinioClient } from 'minio';

import {
  minioAccessKey,
  minioBucketName,
  minioEndpoint,
  minioPort, minioRegion, minioSecretKey, minioUseSSL,
} from '../config.js';

if (!minioAccessKey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
if (!minioSecretKey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}

const minioClient = new MinioClient({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: minioUseSSL,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
  region: minioRegion,
});

export async function computePresignedPutUrl(objectName: string): Promise<string> {
  const expire = 60 * 60 * 24 * 7; // 7 days
  return await minioClient.presignedPutObject(minioBucketName, objectName, expire);
}

export async function computePresignedGetUrl(objectName: string): Promise<string> {
  // One hour
  const expire = 3600;
  return await minioClient.presignedGetObject(minioBucketName, objectName, expire);
}

export async function assertMinioIsHealthy(): Promise<void> {
  let exists: boolean;
  try {
    exists = await minioClient.bucketExists(minioBucketName);
  } catch (error) {
    throw new Error(`Minio is not healthy: ${(error as Error).message}`);
  }
  if (!exists) {
    throw new Error(`Minio bucket ${minioBucketName} does not exist`);
  }
}
