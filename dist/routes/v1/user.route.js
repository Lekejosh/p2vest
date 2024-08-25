"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const config_1 = require("../../config");
const user_controller_1 = __importDefault(require("../../controllers/user.controller"));
const router = (0, express_1.Router)();
router
    .route("/")
    .get((0, auth_middleware_1.default)(config_1.ROLE.ADMIN), user_controller_1.default.getUsers)
    .post((0, auth_middleware_1.default)(config_1.ROLE.ADMIN), user_controller_1.default.create);
router.route("/me").get((0, auth_middleware_1.default)(config_1.ROLE.USER), user_controller_1.default.getMe);
exports.default = router;
