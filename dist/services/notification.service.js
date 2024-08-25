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
exports.NotificationService = void 0;
const notification_repository_1 = require("../repositories/notification.repository");
const task_repository_1 = require("../repositories/task.repository");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
class NotificationService {
    constructor() {
        this.notificationRepository = new notification_repository_1.NotificationRepository();
        this.taskRepository = new task_repository_1.TaskRepository();
    }
    create(userId, taskId, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(taskId);
            if (!task)
                throw new custom_error_1.default("Task not found", 404);
            yield this.notificationRepository.create({ userId, taskId, message });
        });
    }
    getNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.notificationRepository.findByUserId(userId);
        });
    }
    getNotification(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.notificationRepository.findById(id, userId);
            if (!notification)
                throw new custom_error_1.default("Notification not found", 404);
            return notification;
        });
    }
    markAsRead(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.notificationRepository.findById(id, userId);
            if (!notification)
                throw new custom_error_1.default("Notification not found", 404);
            yield this.notificationRepository.markAsRead(id, userId);
            return;
        });
    }
    delete(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.notificationRepository.findById(id, userId);
            if (!notification)
                throw new custom_error_1.default("Notification not found", 404);
            yield this.notificationRepository.delete(id, userId);
            return;
        });
    }
}
exports.NotificationService = NotificationService;
