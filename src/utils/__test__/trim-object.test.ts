import trimObjectStrings from "../trim-object-string";
import { describe, it, expect } from "vitest";

describe("trimObjectStrings", () => {
  it("should trim whitespace from all string values in a flat object", () => {
    const obj = {
      name: "   John Doe   ",
      age: 30,
      city: "   New York   ",
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.name).toBe("John Doe");
    expect(trimmedObj.age).toBe(30);
    expect(trimmedObj.city).toBe("New York");
  });

  it("should trim whitespace from all string values in a nested object", () => {
    const obj = {
      person: {
        name: "   John Doe   ",
        age: 30,
      },
      address: {
        city: "   New York   ",
        street: "   123 Elm Street   ",
      },
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.person.name).toBe("John Doe");
    expect(trimmedObj.person.age).toBe(30);
    expect(trimmedObj.address.city).toBe("New York");
    expect(trimmedObj.address.street).toBe("123 Elm Street");
  });

  it("should handle non-string values without modification", () => {
    const obj = {
      name: "   John Doe   ",
      age: 30,
      isActive: true,
      address: {
        city: "   New York   ",
        zipCode: 10001,
      },
      hobbies: ["   Reading   ", "   Running   "],
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.name).toBe("John Doe");
    expect(trimmedObj.age).toBe(30);
    expect(trimmedObj.isActive).toBe(true);
    expect(trimmedObj.address.city).toBe("New York");
    expect(trimmedObj.address.zipCode).toBe(10001);
    expect(trimmedObj.hobbies[0]).toBe("Reading");
    expect(trimmedObj.hobbies[1]).toBe("Running");
  });

  it("should handle empty strings", () => {
    const obj = {
      name: "",
      age: 30,
      city: "   ",
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.name).toBe("");
    expect(trimmedObj.age).toBe(30);
    expect(trimmedObj.city).toBe("");
  });

  it("should handle null and undefined values", () => {
    const obj = {
      name: "   John Doe   ",
      age: null,
      city: undefined,
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.name).toBe("John Doe");
    expect(trimmedObj.age).toBeNull();
    expect(trimmedObj.city).toBeUndefined();
  });

  it("should handle arrays of strings", () => {
    const obj = {
      names: ["   John Doe   ", "   Jane Smith   "],
      ages: [30, 25],
    };

    const trimmedObj = trimObjectStrings(obj);

    expect(trimmedObj.names[0]).toBe("John Doe");
    expect(trimmedObj.names[1]).toBe("Jane Smith");
    expect(trimmedObj.ages[0]).toBe(30);
    expect(trimmedObj.ages[1]).toBe(25);
  });
});
