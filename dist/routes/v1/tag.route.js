"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskTag_controller_1 = __importDefault(require("../../controllers/taskTag.controller"));
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const config_1 = require("../../config");
const router = (0, express_1.Router)();
router
    .route("/tasks/:id")
    .get((0, auth_middleware_1.default)(config_1.ROLE.USER), taskTag_controller_1.default.getTagsForTask)
    .put((0, auth_middleware_1.default)(config_1.ROLE.USER), taskTag_controller_1.default.addTagToTask)
    .delete((0, auth_middleware_1.default)(config_1.ROLE.USER), taskTag_controller_1.default.removeTagFromTask);
router
    .route("/tasks/:id/all")
    .delete((0, auth_middleware_1.default)(config_1.ROLE.USER), taskTag_controller_1.default.removeAllTagsFromTask);
exports.default = router;
