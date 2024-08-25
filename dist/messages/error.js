"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeNotFound = exports.categoryNotFound = exports.AccountDetailsNotFound = exports.businessNotFound = exports.accountExists = exports.invalidToken = exports.userNotFound = exports.requiredFields = void 0;
exports.requiredFields = {
    message: "All required fields not provided",
    code: 422,
};
exports.userNotFound = {
    message: "User not found",
    code: 404,
};
exports.invalidToken = {
    message: "invalid or expired token",
    code: 403,
};
exports.accountExists = {
    message: "Bank account already linked to this business",
    code: 400,
};
exports.businessNotFound = {
    message: "Company not found",
    code: 404,
};
exports.AccountDetailsNotFound = {
    message: "No account Details found",
    code: 404,
};
exports.categoryNotFound = {
    message: "Category not found",
    code: 404,
};
exports.typeNotFound = {
    message: "Business type not found",
    code: 404,
};
