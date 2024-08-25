import CustomError from "./custom-error";

interface StringIndexedObject {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
}

export function validateRequiredFields(
  data: StringIndexedObject,
  requiredFields: string[],
) {
  for (const field of requiredFields) {
    if (!data[field]) {
      throw new CustomError(`${field} not provided`, 422);
    }
  }
}

export function validateEmail(email: string) {
  const emailRegex = /^[a-z0-9._%+-]+@([a-z0-9.-]+\.)+[a-z]{2,}$/;
  if (!emailRegex.test(email)) {
    throw new CustomError("Please provide a valid email address", 422);
  }
}

export function validateUsername(username: string) {
  const minLength = 3; // Minimum length of username
  const maxLength = 20; // Maximum length of username

  // Regex to allow alphanumeric characters, underscores, periods, and hyphens
  const usernameRegex = /^[a-zA-Z0-9._-]+$/;

  // Check if username is empty or has invalid characters
  if (username.trim() === "" || !usernameRegex.test(username)) {
    throw new CustomError(
      "Invalid username format. Only alphanumeric characters, underscores, periods, and hyphens are allowed.",
      422,
    );
  }

  // Check length constraints
  if (username.length < minLength || username.length > maxLength) {
    throw new CustomError(
      `Username must be between ${minLength} and ${maxLength} characters long.`,
      422,
    );
  }
}

export function passwordValidator(password: string) {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,11}$/;

  if (!regex.test(password)) {
    throw new CustomError(
      "Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.",
      422,
    );
  }
}
