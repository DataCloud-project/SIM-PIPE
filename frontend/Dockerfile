FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY vite.config.ts svelte.config.js ./
COPY tailwind.config.cjs tailwind.config.cjs ./
COPY postcss.config.cjs postcss.config.cjs ./
COPY ./static ./static
COPY ./src ./src
RUN npm run build

FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder --chown=node:node /app/build ./build
EXPOSE 3000
CMD ["node", "build/index.js"]