"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stream = exports.logger = void 0;
// src/utils/logger.ts
const winston_1 = require("winston");
const { combine, timestamp, printf, colorize } = winston_1.format;
const customFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});
const logger = (0, winston_1.createLogger)({
    level: "info",
    format: combine(timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), colorize(), customFormat),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: "logs/error.log", level: "error" }),
        new winston_1.transports.File({ filename: "logs/combined.log" }),
    ],
});
exports.logger = logger;
const stream = {
    write: (message) => {
        logger.info(message.trim());
    },
};
exports.stream = stream;
