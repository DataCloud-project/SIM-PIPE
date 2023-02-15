import expressAsyncHandler from 'express-async-handler';
import { createProxyMiddleware } from 'http-proxy-middleware';
import type { RequestHandler } from 'express';

import { hasuraEndpoint } from '../../../config.js';

export default function hasuraProxyMiddleware(): RequestHandler {
  return expressAsyncHandler(createProxyMiddleware({
    target: hasuraEndpoint,
    changeOrigin: true,
    pathRewrite: {
      '^/hasura/graphql': '',
    },
  }));
}
