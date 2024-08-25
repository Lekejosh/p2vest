"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const trim_object_string_1 = __importDefault(require("../utils/trim-object-string"));
const trimIncomingRequests = (req, res, next) => {
    if (req.body) {
        req.body = (0, trim_object_string_1.default)(req.body);
    }
    if (req.body.email) {
        req.body.email = req.body.email.toLowerCase();
    }
    if (req.query) {
        req.query = (0, trim_object_string_1.default)(req.query);
    }
    if (req.params) {
        req.params = (0, trim_object_string_1.default)(req.params);
    }
    next();
};
exports.default = trimIncomingRequests;
