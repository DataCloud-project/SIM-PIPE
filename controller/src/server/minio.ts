import minio from 'minio';

const accessKey = process.env.MINIO_ACCESS_KEY;
if (!accessKey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
const secretKey = process.env.MINIO_SECRET_KEY;
if (!secretKey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}
const bucketName = process.env.MINIO_BUCKET_NAME ?? 'simpipe';

const minioClient = new minio.Client({
  endPoint: process.env.MINIO_ENDPOINT ?? 'localhost',
  port: process.env.MINIO_PORT ? Number.parseInt(process.env.MINIO_PORT, 10) : undefined,
  useSSL: !!process.env.MINIO_USE_SSL,
  accessKey,
  secretKey,
});

export async function computePresignedPutUrl(objectName: string): Promise<string> {
  const expire = 60 * 60 * 24 * 7; // 7 days
  return await minioClient.presignedPutObject(bucketName, objectName, expire);
}

export async function computePresignedGetUrl(objectName: string): Promise<string> {
  // One hour
  const expire = 3600;
  return await minioClient.presignedGetObject(bucketName, objectName, expire);
}
