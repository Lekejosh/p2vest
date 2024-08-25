"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const helmet_1 = __importDefault(require("helmet"));
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const logger_1 = require("../utils/logger");
const morgan_1 = __importDefault(require("morgan"));
exports.default = (app) => {
    app.set("trust proxy", 1);
    app.use((0, compression_1.default)({
        level: 6,
        threshold: 0,
        filter: (req, res) => {
            if (req.headers["x-no-compression"]) {
                return false;
            }
            return compression_1.default.filter(req, res);
        },
    }));
    app.use((0, helmet_1.default)({ contentSecurityPolicy: false }));
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)("combined", { stream: logger_1.stream }));
    return app;
};
