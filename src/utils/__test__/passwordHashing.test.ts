import bcrypt from "bcryptjs";
import { hashPassword, verifyPassword } from "../passwordHashing";
import { describe, it, expect, vi } from "vitest";

const hashSpy = vi
  .spyOn(bcrypt, "hash")
  .mockImplementation((password: string) =>
    Promise.resolve(`hashed:${password}`),
  );
const compareSpy = vi
  .spyOn(bcrypt, "compare")
  .mockImplementation((password: string, hashed: string) =>
    Promise.resolve(hashed === `hashed:${password}`),
  );

describe("Password Utils", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "password123";
      const hashedPassword = await hashPassword(password);

      expect(hashSpy).toHaveBeenCalledWith(password, 10);
      expect(hashedPassword).toEqual("hashed:password123");
    });
  });

  describe("verifyPassword", () => {
    it("should verify a correct password", async () => {
      const password = "password123";
      const hashedPassword = "hashed:password123";

      const isCorrect = await verifyPassword(password, hashedPassword);

      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
      expect(isCorrect).toBeTruthy();
    });

    it("should reject an incorrect password", async () => {
      const password = "password123";
      const hashedPassword = "hashed:password456";

      const isCorrect = await verifyPassword(password, hashedPassword);

      expect(compareSpy).toHaveBeenCalledWith(password, hashedPassword);
      expect(isCorrect).toBeFalsy();
    });
  });
});
