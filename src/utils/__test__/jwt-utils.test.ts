/* eslint-disable @typescript-eslint/ban-ts-comment */
import JWT from "jsonwebtoken";
import {
  generateAuthTokens,
  verifyAccess,
  verifyRefresh,
  tokenDecode,
} from "../jwt.utils";
import { JWT_SECRET, APP_NAME } from "../../config";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";

vi.mock("../../config", async () => {
  const actual = await vi.importActual("../../config");
  return {
    ...actual,
    JWT_SECRET: "testsecret",
    APP_NAME: "TestApp",
    REDIS: {
      URL: "redis://localhost:6379",
    },
  };
});

vi.mock("crypto", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    randomBytes: vi.fn(() => ({
      toString: vi.fn(() => "randomHexString"),
    })),
  };
});

vi.mock("bcryptjs", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    //@ts-ignore
    ...actual,
    hash: vi.fn(() => "hashedString"),
  };
});
vi.mock("../../config/database/redis", () => {
  const mClient = {
    del: vi.fn(),
    setex: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  };
  return {
    __esModule: true,
    default: mClient,
    createClient: () => mClient,
  };
});

describe("Auth Utils", () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let client: any;

  beforeAll(async () => {
    const redisModule = await import("../../config/database/redis");
    client = redisModule.default;
    client.connect();
  });

  afterAll(() => {
    client.disconnect();
  });
  describe("generateAuthTokens", () => {
    it("should generate valid access and refresh tokens", async () => {
      const userId = "12345";
      const { accessToken, refreshToken } = await generateAuthTokens(userId);

      expect(accessToken).toBeDefined();
      expect(typeof accessToken).toBe("string");
      expect(refreshToken).toBeDefined();
      expect(typeof refreshToken).toBe("string");

      const decodedAccess = JWT.verify(accessToken, JWT_SECRET!);
      expect(decodedAccess).toHaveProperty("id", userId);

      const decodedRefresh = JWT.verify(refreshToken, JWT_SECRET!);
      expect(decodedRefresh).toHaveProperty("id", userId);

      expect(client.del).toHaveBeenCalledWith(`${userId}:refresh`);
      expect(client.setex).toHaveBeenCalled();
    });

    it("should set the correct expiration time for access token", async () => {
      const userId = "12345";
      const { accessToken } = await generateAuthTokens(userId);

      const decoded = JWT.verify(accessToken, JWT_SECRET!) as { exp: number };
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeDifference = expirationTime - currentTime;

      expect(timeDifference).toBeGreaterThan(0);
      expect(timeDifference).toBeLessThanOrEqual(10 * 60 * 1000);
    });

    it("should set the correct expiration time for refresh token", async () => {
      const userId = "12345";
      const { refreshToken } = await generateAuthTokens(userId);

      const decoded = JWT.verify(refreshToken, JWT_SECRET!) as { exp: number };
      const expirationTime = decoded.exp * 1000;
      const currentTime = Date.now();
      const timeDifference = expirationTime - currentTime;

      expect(timeDifference).toBeGreaterThan(0);
      expect(timeDifference).toBeLessThanOrEqual(30 * 60 * 1000);
    });
  });

  describe("verifyAccess", () => {
    it("should verify a valid access token", async () => {
      const userId = "12345";
      const { accessToken } = await generateAuthTokens(userId);

      const decoded = await verifyAccess(accessToken);

      expect(decoded).toHaveProperty("id", userId);
    });

    it("should throw an error for an invalid access token", async () => {
      const invalidToken = "invalidtoken";

      await expect(verifyAccess(invalidToken)).rejects.toThrow(
        JWT.JsonWebTokenError
      );
    });

    it("should throw an error for an expired access token", async () => {
      const expiredToken = JWT.sign({ id: "12345" }, JWT_SECRET!, {
        expiresIn: "1ms",
        issuer: APP_NAME!,
        audience: APP_NAME!,
      });

      await new Promise((resolve) => setTimeout(resolve, 2));

      await expect(verifyAccess(expiredToken)).rejects.toThrow(
        JWT.TokenExpiredError
      );
    });
  });

  describe("verifyRefresh", () => {
    it("should verify a valid refresh token", async () => {
      const userId = "12345";
      const { refreshToken } = await generateAuthTokens(userId);

      const decoded = await verifyRefresh(refreshToken);

      expect(decoded).toHaveProperty("id", userId);
    });

    it("should throw an error for an invalid refresh token", async () => {
      const invalidToken = "invalidtoken";

      await expect(verifyRefresh(invalidToken)).rejects.toThrow(
        JWT.JsonWebTokenError
      );
    });

    it("should throw an error for an expired refresh token", async () => {
      const expiredToken = JWT.sign(
        { id: "12345", refreshToken: "randomHexString" },
        JWT_SECRET!,
        {
          expiresIn: "1ms",
          issuer: APP_NAME!,
          audience: APP_NAME!,
        }
      );

      await new Promise((resolve) => setTimeout(resolve, 2));

      await expect(verifyRefresh(expiredToken)).rejects.toThrow(
        JWT.TokenExpiredError
      );
    });
  });

  describe("tokenDecode", () => {
    it("should decode a valid token", async () => {
      const userId = "12345";
      const { accessToken } = await generateAuthTokens(userId);

      const decoded = await tokenDecode(accessToken);

      expect(decoded).toHaveProperty("id", userId);
    });

    it("should return null for an invalid token", async () => {
      const invalidToken = "invalidtoken";

      const decoded = await tokenDecode(invalidToken);

      expect(decoded).toBeNull();
    });
  });
});
