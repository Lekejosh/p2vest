"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequiredFields = validateRequiredFields;
exports.validateEmail = validateEmail;
exports.validateUsername = validateUsername;
exports.passwordValidator = passwordValidator;
const custom_error_1 = __importDefault(require("./custom-error"));
function validateRequiredFields(data, requiredFields) {
    for (const field of requiredFields) {
        if (!data[field]) {
            throw new custom_error_1.default(`${field} not provided`, 422);
        }
    }
}
function validateEmail(email) {
    const emailRegex = /^[a-z0-9._%+-]+@([a-z0-9.-]+\.)+[a-z]{2,}$/;
    if (!emailRegex.test(email)) {
        throw new custom_error_1.default("Please provide a valid email address", 422);
    }
}
function validateUsername(username) {
    const minLength = 3; // Minimum length of username
    const maxLength = 20; // Maximum length of username
    // Regex to allow alphanumeric characters, underscores, periods, and hyphens
    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    // Check if username is empty or has invalid characters
    if (username.trim() === "" || !usernameRegex.test(username)) {
        throw new custom_error_1.default("Invalid username format. Only alphanumeric characters, underscores, periods, and hyphens are allowed.", 422);
    }
    // Check length constraints
    if (username.length < minLength || username.length > maxLength) {
        throw new custom_error_1.default(`Username must be between ${minLength} and ${maxLength} characters long.`, 422);
    }
}
function passwordValidator(password) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[a-zA-Z\d!@#$%^&*(),.?":{}|<>]{8,11}$/;
    if (!regex.test(password)) {
        throw new custom_error_1.default("Password must be 8-11 characters long, include at least one special character, one uppercase letter, and one lowercase letter.", 422);
    }
}
