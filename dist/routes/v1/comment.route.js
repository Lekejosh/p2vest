"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = __importDefault(require("../../middlewares/auth.middleware"));
const config_1 = require("../../config");
const comment_controller_1 = __importDefault(require("../../controllers/comment.controller"));
const router = (0, express_1.Router)();
router
    .route("/tasks/:id")
    .post((0, auth_middleware_1.default)(config_1.ROLE.USER), comment_controller_1.default.create)
    .get((0, auth_middleware_1.default)(config_1.ROLE.USER), comment_controller_1.default.getComments);
router
    .route("/:id")
    .get((0, auth_middleware_1.default)(config_1.ROLE.USER), comment_controller_1.default.getComment)
    .put((0, auth_middleware_1.default)(config_1.ROLE.USER), comment_controller_1.default.updateComment)
    .delete((0, auth_middleware_1.default)(config_1.ROLE.USER), comment_controller_1.default.delete);
exports.default = router;
