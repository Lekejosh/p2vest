"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const config_1 = require("../../config");
const notification_controller_1 = __importDefault(require("../../controllers/notification.controller"));
const router = (0, express_1.Router)();
router.route("/").get((0, auth_middleware_1.default)(config_1.ROLE.USER), notification_controller_1.default.getNotifications);
router
    .route("/:id")
    .get((0, auth_middleware_1.default)(config_1.ROLE.USER), notification_controller_1.default.getNotification)
    .put((0, auth_middleware_1.default)(config_1.ROLE.USER), notification_controller_1.default.readNotification)
    .delete((0, auth_middleware_1.default)(config_1.ROLE.USER), notification_controller_1.default.deleteNotification);
exports.default = router;
