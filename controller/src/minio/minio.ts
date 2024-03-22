import { Client as MinioClient } from 'minio';
import { URL } from 'node:url';
import type { BucketItem, BucketItemFromList, BucketItemStat } from 'minio';

import {
  minioAccessKey,
  minioBucketName,
  minioInternalUrl,
  minioPublicUrl,
  minioRegion,
  minioSecretKey,
} from '../config.js';

export type ArtifactItem = BucketItem & { bucketName: string };

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

// get presigned put url - for uploading object (artifact)
export async function computePresignedPutUrl(
  objectName: string, _bucketName?: string): Promise<string> {
  const bucketName = _bucketName || minioBucketName;
  const expire = 60 * 10; // 10 minutes before url expires
  return await minioPublicClient.presignedPutObject(bucketName, objectName, expire);
}

// get presigned get url - for downloading object (artifact)
export async function computePresignedGetUrl(
  objectName: string, _bucketName?: string): Promise<string> {
  const bucketName = _bucketName || minioBucketName;
  const expire = 60 * 10; // 10 minutes before url expires
  return await minioPublicClient.presignedGetObject(bucketName, objectName, expire);
}

// get the object (artifact) size
export async function getObjectSize(objectName: string, _bucketName: string): Promise<number> {
  const bucketName = _bucketName || minioBucketName;
  const stat = await minioInternalClient.statObject(bucketName, objectName);
  return stat.size;
}

// get all objects (artifacts) in a bucket -- default bucket is minioBucketName
/*
export async function listAllObjects(
  _bucketName: string): Promise<BucketItem[]> {
  const bucketName = _bucketName || minioBucketName;
  // console.log("bucketName: ",bucketName);
  const stream = minioInternalClient.listObjectsV2(bucketName, '', true);
  // const stream = minioInternalClient.listObjects(bucketName, '', true);
  const objects: BucketItem[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (object) => {
      objects.push(object);
    });
    stream.on('end', () => {
      resolve(objects);
    });
    stream.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      reject(error);
    });
  });
}
*/
// get all objects (artifacts) in a bucket -- default bucket is minioBucketName
export async function listAllObjects(
  _bucketName?: string): Promise<ArtifactItem[]> {
  const bucketName = _bucketName || minioBucketName;
  // console.log("bucketName: ",bucketName);
  const stream = minioInternalClient.listObjectsV2(bucketName, '', true);
  // const stream = minioInternalClient.listObjects(bucketName, '', true);
  const objects: ArtifactItem[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (object) => {
      const artifactItem = object as ArtifactItem;
      artifactItem.bucketName = bucketName;
      objects.push(artifactItem);
    });
    stream.on('end', () => {
      resolve(objects);
    });
    stream.on('error', (error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      reject(error);
    });
  });
}

// get metadata about single object (artifact)
export async function getObjectMetadata(
  objectName: string, _bucketName?: string): Promise<BucketItemStat> {
  const bucketName = _bucketName || minioBucketName;
  const metadata = await minioInternalClient.statObject(bucketName, objectName);
  return metadata;
}

// get buckets
export async function listAllBuckets(): Promise<BucketItemFromList[]> {
  return await minioInternalClient.listBuckets();
}

// check if a bucket exists
/* -- not currently used
export async function bucketExists(bucketName: string): Promise<boolean> {
  return await minioInternalClient.bucketExists(bucketName);
}
*/

// create bucket
export async function createBucket(bucketName: string): Promise<string> {
  return new Promise((resolve, reject) => {
    minioInternalClient.makeBucket(bucketName, minioRegion, (error) => {
      if (error) {
        // console.log('Error creating bucket.', error);
        reject(error);
      } else {
        // console.log(`Bucket "${bucketName}" created successfully in "${minioRegion}".`);
        resolve(bucketName);
      }
    });
  });
}

// delete bucket
export async function deleteBucket(bucketName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    minioInternalClient.removeBucket(bucketName, (error) => {
      if (error) {
        // console.log('Error deleting bucket.', error);
        reject(error);
      } else {
        // console.log(`Bucket "${bucketName}" deleted successfully.`);
        resolve(true);
      }
    });
  });
}

// delete objects (artifacts) in a bucket
export async function deleteObjects(objects: string[], bucketName: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    minioInternalClient.removeObjects(bucketName, objects, (error) => {
      if (error) {
        // console.log('Error deleting objects.', error);
        reject(error);
      } else {
        // console.log(`Objects "${objects}" deleted successfully.`);
        resolve(true);
      }
    });
  });
}
