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
exports.TaskService = void 0;
const client_1 = require("@prisma/client");
const task_repository_1 = require("../repositories/task.repository");
const user_repository_1 = require("../repositories/user.repository");
const validation_utils_1 = require("../utils/validation-utils");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const taskTag_service_1 = require("./taskTag.service");
const notification_service_1 = require("./notification.service");
class TaskService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository();
        this.userRepository = new user_repository_1.UserRepository();
        this.taskTagService = new taskTag_service_1.TaskTagService();
        this.notificationService = new notification_service_1.NotificationService();
    }
    create(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["title"]);
            if (data.status && !Object.values(client_1.TaskStatus).includes(data.status)) {
                throw new custom_error_1.default("Status is not a valid type", 422);
            }
            if (data.dueDate) {
                data.dueDate = new Date(data.dueDate);
                if (!(data.dueDate instanceof Date)) {
                    throw new custom_error_1.default("Date is not a valid type", 422);
                }
            }
            if (data.assignedTo) {
                const user = yield this.userRepository.findById(data.assignedTo);
                if (!user) {
                    throw new custom_error_1.default("Assigned user does not exist", 422);
                }
            }
            const task = yield this.taskRepository.createTask(data, userId);
            let recipientUserId = null;
            if (task.createdBy && task.createdBy !== userId) {
                recipientUserId = task.createdBy;
            }
            else if (task.assignedTo && task.assignedTo !== userId) {
                recipientUserId = task.assignedTo;
            }
            if (recipientUserId) {
                yield this.notificationService.create(recipientUserId, task.id, `A new Task has been assigned to you: ${task.title}`);
            }
            yield this.taskTagService.ensureDefaultTags(task.id, userId);
            return task;
        });
    }
    getTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            return task;
        });
    }
    updateTask(id, data, user) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            if (task.assignedTo !== user.id &&
                task.createdBy !== user.id &&
                user.role !== "ADMIN") {
                throw new custom_error_1.default("Task not found", 404);
            }
            if (data.status !== undefined && !Object.values(client_1.TaskStatus).includes(data.status)) {
                throw new custom_error_1.default("Status is not a valid type", 422);
            }
            if (data.dueDate) {
                data.dueDate = new Date(data.dueDate);
                if (!(data.dueDate instanceof Date)) {
                    throw new custom_error_1.default("Date is not a valid type", 422);
                }
            }
            data.assignedTo = undefined;
            return yield this.taskRepository.updateTask(id, data);
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            return yield this.taskRepository.deleteTask(id);
        });
    }
    getTasksByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!Object.values(client_1.TaskStatus).includes(status)) {
                throw new custom_error_1.default("Status is not a valid type", 422);
            }
            yield this.taskRepository.findByStatus(status);
            return;
        });
    }
    assignTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["userId"]);
            const task = yield this.taskRepository.findById(id);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            const user = yield this.userRepository.findById(data.userId);
            if (!user) {
                throw new custom_error_1.default("User not found", 404);
            }
            yield this.notificationService.create(data.userId, task.id, `You have been assigned from the task: ${task.title}`);
            return yield this.taskRepository.updateTask(id, {
                assignedTo: data.userId,
            });
        });
    }
    unAssignTask(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(id);
            if (!task) {
                throw new custom_error_1.default("Task not found", 404);
            }
            yield this.taskRepository.updateTask(id, {
                assignedTo: null,
            });
            if (task.assignedTo && task.assignedTo !== userId) {
                yield this.notificationService.create(task.assignedTo, task.id, `You have been unassigned from the task: ${task.title}`);
            }
            return;
        });
    }
    getTasksByUser(userId, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findById(userId);
            if (!user) {
                throw new custom_error_1.default("User not found", 404);
            }
            return yield this.taskRepository.findTasksByUser(query, userId);
        });
    }
}
exports.TaskService = TaskService;
