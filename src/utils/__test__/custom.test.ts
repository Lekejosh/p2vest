import { describe, it, expect } from "vitest";
import CustomError from "../custom-error";

describe("CustomError", () => {
  it("should create an instance of CustomError with default status code", () => {
    const message = "Default error";
    const error = new CustomError(message);

    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(message);
    expect(error.status).toBe(400);
    expect(error.name).toBe("CustomError");
  });

  it("should create an instance of CustomError with specified status code", () => {
    const message = "Not Found";
    const statusCode = 404;
    const error = new CustomError(message, statusCode);

    expect(error).toBeInstanceOf(CustomError);
    expect(error.message).toBe(message);
    expect(error.status).toBe(statusCode);
    expect(error.name).toBe("CustomError");
  });

  it("should have correct stack trace", () => {
    const message = "Stack trace error";
    const error = new CustomError(message);

    expect(error.stack).toContain(`CustomError: ${message}`);
  });

  it("should inherit from Error", () => {
    const message = "Inheritance error";
    const error = new CustomError(message);

    expect(error).toBeInstanceOf(Error);
  });
});
