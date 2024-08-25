"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authentication_controller_1 = __importDefault(require("../../controllers/authentication.controller"));
const router = (0, express_1.Router)();
router.route("/").post(authentication_controller_1.default.register);
router.route("/login").post(authentication_controller_1.default.login);
router.route("/tokens/refresh").get(authentication_controller_1.default.refreshToken);
exports.default = router;
