"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RABBITMQ = exports.SMS = exports.MAILER = exports.APP_NAME = exports.REDIS = exports.REDIS_URL = exports.parseRedisUrl = exports.port = exports.JWT_SECRET = exports.DB = exports.ROLE = exports.environment = void 0;
require("dotenv/config");
exports.environment = process.env.NODE_ENV || "development";
exports.ROLE = {
    USER: ["USER", "ADMIN"],
    ADMIN: ["ADMIN"],
};
exports.DB = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    uri: process.env.DB_URI,
};
exports.JWT_SECRET = process.env.JWT_SECRET || "demo";
exports.port = process.env.PORT || 9999;
const parseRedisUrl = (redisUrl) => {
    const redisRegex = /^redis:\/\/(?:(.*?):(.*?)@)?(.*?):(.*?)$/;
    const matches = redisUrl.match(redisRegex);
    if (!matches) {
        throw new Error("Invalid Redis URL format");
    }
    const [, username, password, host, port] = matches;
    return {
        host,
        port: Number(port),
        password: password,
        username: username,
    };
};
exports.parseRedisUrl = parseRedisUrl;
exports.REDIS_URL = process.env.REDIS_URL;
exports.REDIS = (0, exports.parseRedisUrl)(exports.REDIS_URL);
exports.APP_NAME = "bifrost";
exports.MAILER = {
    USER: process.env.MAILER_USER,
    PORT: process.env.MAILER_PORT,
    SECURE: process.env.MAILER_SECURE,
    PASSWORD: process.env.MAILER_PASSWORD,
    HOST: process.env.MAILER_HOST,
};
exports.SMS = {
    API: process.env.SMS_API,
};
exports.RABBITMQ = process.env.RABBITMQ;
