import { describe, it, expect } from "vitest";
import { passwordValidator } from "../validation-utils";
import CustomError from "../custom-error";

describe("passwordValidator", () => {
  it("should return for valid passwords", () => {
    expect(() => passwordValidator("Valid@123")).not.toThrow();
    expect(() => passwordValidator("Test@Abc")).not.toThrow();
  });

  it("should return an error message for passwords that are too short", () => {
    expect(() => passwordValidator("V@1a")).toThrow(
      new CustomError(
        `Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.`,
        422,
      ),
    );
  });

  it("should return an error message for passwords that are too long", () => {
    expect(() => passwordValidator("Valid@123457")).toThrow(
      new CustomError(
        `Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.`,
        422,
      ),
    );
  });

  it("should return an error message for passwords without a special character", () => {
    expect(() => passwordValidator("Valid123")).toThrow(
      new CustomError(
        `Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.`,
        422,
      ),
    );
  });

  it("should return an error message for passwords without an uppercase letter", () => {
    expect(() => passwordValidator("valid@123")).toThrow(
      new CustomError(
        `Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.`,
        422,
      ),
    );
  });

  it("should return an error message for passwords without a lowercase letter", () => {
    expect(() => passwordValidator("VALID@123")).toThrow(
      new CustomError(
        `Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.`,
        422,
      ),
    );
  });
});
