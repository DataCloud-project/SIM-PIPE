FROM node:18-alpine as builder
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci --no-optional
COPY src/ ./src
RUN npm run build

FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-optional
COPY --from=builder /app/dist/ ./
EXPOSE 9000
CMD ["--experimental-specifier-resolution=node", "index.js"]