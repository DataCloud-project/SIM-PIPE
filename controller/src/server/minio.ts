import got, { RequestError } from 'got';
import minio from 'minio';
import { setTimeout } from 'node:timers/promises';
import { CookieJar } from 'tough-cookie';

import {
  minioAccessKey, minioApiAccessKey,
  minioApiEndpoint, minioApiPort,
  minioApiSecretKey, minioApiUseSSL,
  minioBucketName, minioEndpoint,
  minioPort, minioSecretKey, minioUseSSL, minioWebhookEndpoint,
} from '../config.js';
import logger from '../logger.js';

if (!minioAccessKey || !minioApiAccessKey) {
  throw new Error('MINIO_ACCESS_KEY is not set');
}
if (!minioSecretKey || !minioApiSecretKey) {
  throw new Error('MINIO_SECRET_KEY is not set');
}

const minioClient = new minio.Client({
  endPoint: minioEndpoint,
  port: minioPort,
  useSSL: minioUseSSL,
  accessKey: minioAccessKey,
  secretKey: minioSecretKey,
});

const minioApiCookieJar = new CookieJar();
const minioApiClient = got.extend({
  prefixUrl: `${minioApiUseSSL ? 'https' : 'http'}://${minioApiEndpoint}:${minioApiPort ?? 9001}/api/v1/`,
  cookieJar: minioApiCookieJar,
  responseType: 'json',
  resolveBodyOnly: true,
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

let hasLoggedIn = false;
export async function apiLogin(): Promise<void> {
  if (hasLoggedIn) {
    return;
  }
  hasLoggedIn = true;
  await minioApiClient.post('login', {
    json: {
      accessKey: minioApiAccessKey,
      secretKey: minioApiSecretKey,
    },
  });
}

interface WebHookConfigurationResult {
  notification_endpoints: {
    account_id: string;
    service: string;
    status: 'online' | 'offline';
  }[] | null;
}

export async function createWebhookEndpoint(): Promise<void> {
  await apiLogin();
  // If a webhook service is already configured, we don't need to create it
  const webhookConfig = await minioApiClient.get('admin/notification_endpoints')
    .json<WebHookConfigurationResult>();
  if (webhookConfig.notification_endpoints?.some(({ service }) => service === 'webhook')) {
    return;
  }

  // Create the webhook
  logger.info('Creating webhook in MinIO');
  const createWebhookPayload = { key_values: [{ key: 'endpoint', value: minioWebhookEndpoint }] };
  const createWebhookResponse = await minioApiClient.put('configs/notify_webhook', {
    json: createWebhookPayload,
  }).json<{ restart: boolean }>();

  // If minio doesn't say to restart we can stop there
  if (!createWebhookResponse.restart) {
    return;
  }

  // Restart minio
  logger.info('Restarting MinIO');
  try {
    await minioApiClient.post('service/restart', { json: {} });
  } catch (error) {
    if (!(error instanceof RequestError && error.code === 'ECONNRESET')) {
      throw error;
    }
  }

  // Wait for minio to be back online
  /* eslint-disable no-await-in-loop */
  for (let tentatives = 0; tentatives < 10; tentatives += 1) {
    // Wait a little while before trying again
    await setTimeout(2000);
    try {
      // Try to login to minio and load the admin info
      await minioApiClient.get('login', { timeout: { request: 2000 } });
      await minioApiClient.get('admin/info', { timeout: { request: 2000 } });
    } catch {
      // If we have an exception, we can try again soon
      // eslint-disable-next-line no-continue
      continue;
    }
    // Check if the webhook is configured now
    const newWebhookConfig = await minioApiClient.get('admin/notification_endpoints')
      .json<WebHookConfigurationResult>();
    if (newWebhookConfig.notification_endpoints?.some(({ service }) => service === 'webhook')) {
      logger.info('MinIO has restarted');
      return;
    }

    throw new Error('Unable to find the created webhook in Minio');
  }
  /* eslint-enable no-await-in-loop */
  throw new Error('Minio did not restart');
}

export async function setupBucket(): Promise<void> {
  await createWebhookEndpoint();

  // Create the bucket if it doesn't already exist
  const bucketExists = await minioClient.bucketExists(minioBucketName);
  if (!bucketExists) {
    logger.info('Creating bucket in MinIO');
    await minioClient.makeBucket(minioBucketName, '');
  }

  // Compute the identifier of the webhook attacked to the bucket
  const notificationArn = minio.buildARN('minio', 'sqs', '', '_', 'webhook');

  // Load the existing bucket notifications
  const notificationConfig = await minioClient.getBucketNotification(minioBucketName) as
    minio.NotificationConfig & { QueueConfiguration: { Queue: string }[] };

  // If the webhook is already attached to the bucket, we don't need to do anything
  if (notificationConfig.QueueConfiguration.some(({ Queue }) => Queue === notificationArn)) {
    return;
  }

  // Create a new notification config with the webhook attached
  logger.info('Attaching webhook to bucket in MinIO');
  const newNotificationConfig = new minio.NotificationConfig();
  const queue = new minio.QueueConfig(notificationArn);
  queue.addEvent(minio.ObjectCreatedAll);
  queue.addEvent(minio.ObjectRemovedAll);
  newNotificationConfig.add(queue);
  await minioClient.setBucketNotification(minioBucketName, newNotificationConfig);
}
