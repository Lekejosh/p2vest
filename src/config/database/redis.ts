import Redis from "ioredis";
import { REDIS } from "../";

const client = new Redis({
  host: REDIS.host,
  port: REDIS.port,
  username: REDIS.username,
  password: REDIS.password,
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

export default client;
