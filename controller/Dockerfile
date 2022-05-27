FROM node:17-alpine

COPY package.json tsconfig.json package-lock.json ./
RUN npm install
COPY src/ src/

CMD npm start
