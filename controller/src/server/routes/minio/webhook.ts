import type { Request, Response } from 'express';

import s3ObjectCreatedEventSchema from './webhook-parser.js';
import type { S3ObjectCreatedEvent } from './webhook-parser.js';

function checkAuthorisationToken(request: Request): boolean {
  const authHeader = request.headers.authorization;
  if (authHeader === undefined) {
    return false;
  }
  const authHeaderParts = authHeader.split(' ');
  if (authHeaderParts.length !== 2) {
    return false;
  }
  const [authType, authToken] = authHeaderParts;
  if (authType !== 'Bearer') {
    return false;
  }
  if (authToken !== process.env.MINIO_WEBHOOK_AUTH_TOKEN) {
    return false;
  }
  return true;
}

export async function minioWebhookHead(
  request: Request, response: Response,
): Promise<void> {
  if (!checkAuthorisationToken(request)) {
    response.sendStatus(401);
    return;
  }
  response.sendStatus(204);
}

export async function minioWebhookPost(
  request: Request, response: Response,
): Promise<void> {
  if (!checkAuthorisationToken(request)) {
    response.sendStatus(401);
    return;
  }
  let event: S3ObjectCreatedEvent;
  try {
    event = s3ObjectCreatedEventSchema.parse(request.body);
  } catch {
    response.sendStatus(400);
    return;
  }

  // TODO: #71 implement file management
  // eslint-disable-next-line no-console
  console.log(event.Records[0].s3.object.key);
  response.sendStatus(204);
}
