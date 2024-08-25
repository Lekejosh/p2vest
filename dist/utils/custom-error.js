"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CustomError extends Error {
    /**
     * Create custom error
     *
     * @param {*} message Error message for request response
     * @param {number} statusCode HTTP status code. Default is 400
     */
    constructor(message, statusCode = 400) {
        super(message);
        this.name = this.constructor.name;
        this.status = statusCode;
    }
}
exports.default = CustomError;
