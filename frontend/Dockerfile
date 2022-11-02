FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM nginx:1.23-alpine
COPY --from=builder --chown=nginx:nginx /app/public /usr/share/nginx/html