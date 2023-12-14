import { Client as MinioClient } from 'minio';
import { URL } from 'node:url';

import {
  minioAccessKey,
  minioBucketName,
  minioInternalUrl,
  minioPublicUrl,
  minioRegion,
  minioSecretKey,
} from '../config.js';

if (!minioAccessKey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
if (!minioSecretKey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}

const parsedMinioPublicUrl = new URL(minioPublicUrl);
const minioPublicClient = new MinioClient({
  endPoint: parsedMinioPublicUrl.hostname,
  port: Number.parseInt(parsedMinioPublicUrl.port, 10) ?? (parsedMinioPublicUrl.protocol === 'https:' ? 443 : 80),
  useSSL: parsedMinioPublicUrl.protocol === 'https:',
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
  region: minioRegion,
});
const parsedMinioInternalUrl = new URL(minioInternalUrl);
const minioInternalClient = new MinioClient({
  endPoint: parsedMinioInternalUrl.hostname,
  port: Number.parseInt(parsedMinioInternalUrl.port, 10) ?? (parsedMinioInternalUrl.protocol === 'https:' ? 443 : 80),
  useSSL: parsedMinioInternalUrl.protocol === 'https:',
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
  region: minioRegion,
});

export async function computePresignedPutUrl(objectName: string): Promise<string> {
  const expire = 60 * 60 * 24 * 7; // 7 days
  return await minioPublicClient.presignedPutObject(minioBucketName, objectName, expire);
}

export async function computePresignedGetUrl(objectName: string): Promise<string> {
  // One hour
  const expire = 3600;
  return await minioPublicClient.presignedGetObject(minioBucketName, objectName, expire);
}

export async function getObjectSize(objectName: string): Promise<number> {
  const stat = await minioInternalClient.statObject(minioBucketName, objectName);
  return stat.size;
}
