import { z } from 'zod';

const s3ObjectCreatedEventSchema = z.object({
  EventName: z.string(),
  Key: z.string(),
  Records: z.array(
    z.object({
      eventVersion: z.string(),
      eventSource: z.string(),
      awsRegion: z.string().optional(),
      eventTime: z.string(),
      eventName: z.string(),
      userIdentity: z.object({
        principalId: z.string(),
      }),
      requestParameters: z.object({
        principalId: z.string(),
        region: z.string().optional(),
        sourceIPAddress: z.string(),
      }),
      responseElements: z.object({}).passthrough(),
      s3: z.object({
        s3SchemaVersion: z.string(),
        configurationId: z.string(),
        bucket: z.object({
          name: z.string(),
          ownerIdentity: z.object({
            principalId: z.string(),
          }),
          arn: z.string(),
        }),
        object: z.object({
          key: z.string(),
          size: z.number(),
          eTag: z.string(),
          contentType: z.string(),
          userMetadata: z.object({}).passthrough(),
          sequencer: z.string(),
        }),
      }),
      source: z.object({
        host: z.string(),
        port: z.string().optional(),
        userAgent: z.string(),
      }),
    }),
  ),
});

export default s3ObjectCreatedEventSchema;

export type S3ObjectCreatedEvent = z.infer<typeof s3ObjectCreatedEventSchema>;
