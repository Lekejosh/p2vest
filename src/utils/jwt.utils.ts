import { APP_NAME, JWT_SECRET } from "../config";
import bcrypt from "bcryptjs";
import JWT, { JwtPayload } from "jsonwebtoken";
import crypto from "crypto";
import client from "../config/database/redis";
import { GenerateTokenInput, refreshTokenDecode } from "../@types/token";

export const generateAuthTokens = async (userId: string) => {
  const token = await sign(userId);
  const hex = crypto.randomBytes(32).toString("hex");
  const refreshToken = await token.refresh(hex);

  const hash = await bcrypt.hash(hex, 10);
  await client.del(`${userId}:refresh`);
  await client.setex(`${userId}:refresh`, 1800, `${hash}`);

  const access = await token.access();
  return { accessToken: access, refreshToken };
};

const sign = async (userId: string) => {
  const access = async () => {
    return JWT.sign({ id: userId }, JWT_SECRET!, {
      expiresIn: "10 mins",
      issuer: APP_NAME!,
      audience: APP_NAME!,
    });
  };

  const refresh = async (token: string) => {
    const refresh = {
      id: userId,
      refreshToken: token,
    };
    return JWT.sign(refresh, JWT_SECRET!, {
      expiresIn: "30 mins",
      issuer: APP_NAME!,
      audience: APP_NAME!,
    });
  };

  return { access, refresh };
};

export const verifyAccess = async (token: string) => {
  return JWT.verify(token, JWT_SECRET!) as GenerateTokenInput;
};
export const verifyRefresh = async (token: string) => {
  return JWT.verify(token, JWT_SECRET!) as refreshTokenDecode;
};

export const tokenDecode = async (token: string) => {
  return JWT.decode(token) as JwtPayload;
};
