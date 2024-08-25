"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentService = void 0;
const comment_repository_1 = require("../repositories/comment.repository");
const task_repository_1 = require("../repositories/task.repository");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const validation_utils_1 = require("../utils/validation-utils");
const notification_service_1 = require("./notification.service");
class CommentService {
    constructor() {
        this.commentRepository = new comment_repository_1.CommentsRepository();
        this.taskRepository = new task_repository_1.TaskRepository();
        this.notificationService = new notification_service_1.NotificationService();
    }
    create(taskId, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["content"]);
            const task = yield this.taskRepository.findById(taskId);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            yield this.commentRepository.create({
                taskId,
                userId,
                content: data.content,
            });
            let recipientUserId = null;
            if (task.createdBy && task.createdBy !== userId) {
                recipientUserId = task.createdBy;
            }
            else if (task.assignedTo && task.assignedTo !== userId) {
                recipientUserId = task.assignedTo;
            }
            if (recipientUserId) {
                yield this.notificationService.create(recipientUserId, task.id, `A new comment has been added to the task: ${task.title}`);
            }
            return;
        });
    }
    getComments(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(taskId);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            return yield this.commentRepository.findByTaskId(taskId);
        });
    }
    getComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.findById(id);
            if (!comment) {
                throw new custom_error_1.default("Comment not found", 404);
            }
            return comment;
        });
    }
    edit(commentId, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.findById(commentId);
            if (!comment) {
                throw new custom_error_1.default("Comment not found", 404);
            }
            if (!data.content)
                return;
            yield this.commentRepository.update(commentId, userId, data.content);
            return;
        });
    }
    delete(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.commentRepository.findById(commentId);
            if (!comment) {
                throw new custom_error_1.default("Comment not found", 404);
            }
            yield this.commentRepository.delete(commentId, userId);
        });
    }
}
exports.CommentService = CommentService;
