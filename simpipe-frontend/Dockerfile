FROM node:16 AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install -g npm
RUN npm install
COPY . ./
ARG SIM_PIPE_CONTROLLER_URL
ENV SIM_PIPE_CONTROLLER_URL $SIM_PIPE_CONTROLLER_URL
RUN npm run build

CMD  ["node", "/app/public/build/index.js"]