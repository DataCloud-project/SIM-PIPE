import * as Minio from 'minio';
import { MINIO_URL, MINIO_PORT, MINIO_ACCESS_KEY, MINIO_SECRET_KEY } from '$env/static/private';

export const minioClient = new Minio.Client({
    endPoint: MINIO_URL,
    port: Number(MINIO_PORT),
    useSSL: false,
    accessKey: MINIO_ACCESS_KEY,
    secretKey: MINIO_SECRET_KEY,
  })