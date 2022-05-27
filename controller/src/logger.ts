import winston from 'winston';

const logConfiguration = {
  transports: [
    new winston.transports.File({
      filename: '../log/controller.log',
    }),
  ],
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'MMM-DD-YYYY HH:mm:ss',
    }),
    winston.format.printf(
      (info) => `${info.level}🏷️: [${info.timestamp as string}]: ${info.message}`,
    ),
  ),
};

const logger = winston.createLogger(logConfiguration);

export default logger;
