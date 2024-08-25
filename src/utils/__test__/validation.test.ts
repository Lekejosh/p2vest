import {
  validateRequiredFields,
  validateEmail,
  validateUsername,
} from "../validation-utils";
import CustomError from "../custom-error";
import { describe, it, expect } from "vitest";

describe("Validation Utils", () => {
  describe("validateRequiredFields", () => {
    it("should not throw an error if all required fields are present", () => {
      const data = { field1: "value1", field2: "value2" };
      const requiredFields = ["field1", "field2"];
      expect(() => validateRequiredFields(data, requiredFields)).not.toThrow();
    });

    it("should throw an error if a required field is missing", () => {
      const data = { field1: "value1", field2: undefined };
      const requiredFields = ["field1", "field2"];
      expect(() => validateRequiredFields(data, requiredFields)).toThrow(
        new CustomError(`field2 not provided`, 422),
      );
    });
  });

  describe("validateEmail", () => {
    it("should not throw an error for a valid email", () => {
      const email = "test@example.com";
      expect(() => validateEmail(email)).not.toThrow();
    });

    it("should throw an error for an invalid email", () => {
      const email = "invalid-email";
      expect(() => validateEmail(email)).toThrow(
        new CustomError("Please provide a valid email address", 422),
      );
    });

    it('should throw an error for an email without "@" symbol', () => {
      const email = "invalidemail.com";
      expect(() => validateEmail(email)).toThrow(
        new CustomError("Please provide a valid email address", 422),
      );
    });

    it("should throw an error for an email without domain", () => {
      const email = "invalid@com";
      expect(() => validateEmail(email)).toThrow(
        new CustomError("Please provide a valid email address", 422),
      );
    });

    it("should throw an error for an email with invalid characters", () => {
      const email = "invalid@ex*ample.com";
      expect(() => validateEmail(email)).toThrow(
        new CustomError("Please provide a valid email address", 422),
      );
    });
  });

  describe("validateUsername", () => {
    it("should not throw an error for a valid name", () => {
      const name = "John";
      expect(() => validateUsername(name)).not.toThrow();
    });
    it("should not throw an error for a valid name", () => {
      const name = "John._-1";
      expect(() => validateUsername(name)).not.toThrow();
    });

    it("should throw an error for an invalid name", () => {
      const name = "John123";
      expect(() => validateUsername(name)).not.toThrow();
    });

    it("should throw an error for a name with special characters", () => {
      const name = "John@Doe";
      expect(() => validateUsername(name)).toThrow(
        new CustomError("Invalid username format. Only alphanumeric characters, underscores, periods, and hyphens are allowed.", 422),
      );
    });
    it("should throw an error for a name with space in between", () => {
      const name = "John Doe";
      expect(() => validateUsername(name)).toThrow(
        new CustomError("Invalid username format. Only alphanumeric characters, underscores, periods, and hyphens are allowed.", 422),
      );
    });
  });
});
