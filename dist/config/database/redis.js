"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const __1 = require("../");
const client = new ioredis_1.default({
    host: __1.REDIS.host,
    port: __1.REDIS.port,
    username: __1.REDIS.username,
    password: __1.REDIS.password,
    maxRetriesPerRequest: null,
    enableReadyCheck: true,
    reconnectOnError(err) {
        const targetError = "READONLY";
        if (err.message.includes(targetError)) {
            return true;
        }
        return false;
    },
    retryStrategy(times) {
        if (times > 10) {
            console.log("Too many retries on REDIS. Connection Terminated");
            return null;
        }
        return Math.min(times * 50, 2000);
    },
    connectionName: "redis-pool",
});
client.on("connect", () => {
    console.log(":::> Connected to Redis database");
});
client.on("error", (err) => {
    console.log("Redis connection Error", err);
});
client.on("disconnect", () => {
    console.log(":::> Disconnected from Redis database");
});
exports.default = client;
