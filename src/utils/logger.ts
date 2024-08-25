// src/utils/logger.ts
import { createLogger, format, transports } from "winston";
import { StreamOptions } from "morgan";

const { combine, timestamp, printf, colorize } = format;

const customFormat = printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    colorize(),
    customFormat,
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" }),
  ],
});

const stream: StreamOptions = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

export { logger, stream };
