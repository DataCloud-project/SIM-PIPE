import minio from 'minio';

import {
  minioAccesskey, minioBucketName, minioEndpoint, minioPort, minioSecretkey, minioUseSSL,
} from '../config.js';

if (!minioAccesskey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
if (!minioSecretkey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}

const minioClient = new minio.Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: minioUseSSL,
  accessKey: minioAccesskey,
  secretKey: minioSecretkey,
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
