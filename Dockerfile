FROM node:17-alpine

COPY controller/package.json controller/tsconfig.json controller/package-lock.json ./
RUN npm install
COPY controller/src/ src/

CMD npm start
