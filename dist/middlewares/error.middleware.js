"use strict";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Possible error names
const errorNames = [
    "CastError",
    "JsonWebTokenError",
    "ValidationError",
    "SyntaxError",
    "TokenExpiredError",
];
const response_1 = __importDefault(require("../utils/response"));
exports.default = (app) => {
    app.use("*", (req, res) => {
        res.status(404).end();
    });
    app.use((error, req, res, next) => {
        if (error.name == "CustomError") {
            res.status(error.status).send((0, response_1.default)(error.message, null, false));
        }
        else if (error.name === "TokenExpiredError") {
            res.status(403).send((0, response_1.default)("Invalid or expired token", null, false));
        }
        else if (error.name === "JsonWebTokenError") {
            res.status(403).send((0, response_1.default)("Invalid or expired token", null, false));
        }
        else if (errorNames.includes(error.name)) {
        }
        else if (error.status === 413) {
            res.status(413).send((0, response_1.default)("Entity too large", null, false));
        }
        else {
            res.status(500).send((0, response_1.default)(error.message, null, false));
        }
    });
    return app;
};
