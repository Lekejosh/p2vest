import "dotenv/config";

export const environment = process.env.NODE_ENV || "development";

export const ROLE = {
  USER: ["USER", "ADMIN"],
  ADMIN: ["ADMIN"],
};

export const DB = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
  uri: process.env.DB_URI,
};
export const JWT_SECRET = process.env.JWT_SECRET || "demo";

export const port = process.env.PORT || 9999;

export const parseRedisUrl = (redisUrl: string) => {
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

export const REDIS_URL = process.env.REDIS_URL!;

export const REDIS = parseRedisUrl(REDIS_URL!);
export const APP_NAME = "bifrost";

export const MAILER = {
  USER: process.env.MAILER_USER,
  PORT: process.env.MAILER_PORT,
  SECURE: process.env.MAILER_SECURE,
  PASSWORD: process.env.MAILER_PASSWORD,
  HOST: process.env.MAILER_HOST,
};
export const SMS = {
  API: process.env.SMS_API,
};

export const RABBITMQ = process.env.RABBITMQ;
