"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const task_controller_1 = __importDefault(require("../../controllers/task.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const config_1 = require("../../config");
const router = (0, express_1.Router)();
router.route("/").post((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.create);
router
    .route("/:id")
    .get((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.getTask)
    .put((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.updateTask)
    .delete((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.deleteTask);
router
    .route("/:id/assign/users")
    .put((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.assignTask);
router.route("/assign/users/:id").get((0, auth_middleware_1.default)(config_1.ROLE.USER), task_controller_1.default.getTasks);
exports.default = router;
