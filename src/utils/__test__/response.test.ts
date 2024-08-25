/* eslint-disable @typescript-eslint/no-explicit-any */
import response, { formatMessage } from "../response";
import { describe, it, expect } from "vitest";

describe("Response Utils", () => {
  describe("response", () => {
    it("should create a response object with default success", () => {
      const result = response("test message", { key: "value" });

      expect(result).toEqual({
        message: "Test message",
        data: { key: "value" },
        success: true,
      });
    });

    it("should create a response object with custom success", () => {
      const result = response("test message", null, false);

      expect(result).toEqual({
        message: "Test message",
        data: null,
        success: false,
      });
    });

    it("should create a response object with null data if not provided", () => {
      const result = response("test message", undefined);

      expect(result).toEqual({
        message: "Test message",
        data: null,
        success: true,
      });
    });
  });

  describe("formatMessage", () => {
    it("should capitalize the first letter of a string", () => {
      const result = formatMessage("test message");

      expect(result).toBe("Test message");
    });

    it("should return an empty string if input is empty", () => {
      const result = formatMessage("");

      expect(result).toBe("");
    });

    it("should handle null input gracefully", () => {
      const result = formatMessage(null as any);

      expect(result).toBe("");
    });

    it("should handle undefined input gracefully", () => {
      const result = formatMessage(undefined as any);

      expect(result).toBe("");
    });
  });
});
