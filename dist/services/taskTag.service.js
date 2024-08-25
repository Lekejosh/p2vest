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
exports.TaskTagService = void 0;
const task_repository_1 = require("../repositories/task.repository");
const taskTag_repository_1 = require("../repositories/taskTag.repository");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
const validation_utils_1 = require("../utils/validation-utils");
const notification_service_1 = require("./notification.service");
const tag_service_1 = require("./tag.service");
class TaskTagService {
    constructor() {
        this.taskRepository = new task_repository_1.TaskRepository();
        this.taskTagRepository = new taskTag_repository_1.TaskTagRepository();
        this.tagService = new tag_service_1.TagService();
        this.notificationService = new notification_service_1.NotificationService();
    }
    addTagToTask(taskId, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["name"]);
            let tag = yield this.tagService.getTagByName(data.name);
            if (!tag)
                tag = yield this.tagService.createTag({ name: data.name });
            const task = yield this.taskRepository.findById(taskId);
            if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
                throw new custom_error_1.default("Task not found", 404);
            }
            const exist = yield this.taskTagRepository.getATask(taskId, tag.id);
            if (exist) {
                throw new custom_error_1.default("Tag already assigned to task", 400);
            }
            let recipientUserId = null;
            if (task.createdBy && task.createdBy !== userId) {
                recipientUserId = task.createdBy;
            }
            else if (task.assignedTo && task.assignedTo !== userId) {
                recipientUserId = task.assignedTo;
            }
            if (recipientUserId) {
                yield this.notificationService.create(recipientUserId, task.id, `A new Tag has been added to the task: ${task.title}`);
            }
            yield this.taskTagRepository.addTagToTask(taskId, tag.id);
        });
    }
    removeTagFromTask(taskId, data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            (0, validation_utils_1.validateRequiredFields)(data, ["name"]);
            const tag = yield this.tagService.getTagByName(data.name);
            if (!tag) {
                throw new custom_error_1.default(`Tag with name ${data.name} does not exist.`, 404);
            }
            const task = yield this.taskRepository.findById(taskId);
            if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
                throw new custom_error_1.default("Task not found", 404);
            }
            yield this.taskTagRepository.removeTagFromTask(taskId, tag.id);
        });
    }
    getTagsForTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const tags = yield this.taskTagRepository.getTagsForTask(taskId);
            return tags.map((tag) => tag.name);
        });
    }
    removeAllTagsFromTask(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.taskRepository.findById(taskId);
            if (!task || task.createdBy !== userId || task.assignedTo !== userId) {
                throw new custom_error_1.default("Task not found", 404);
            }
            yield this.taskTagRepository.removeAllTagsFromTask(taskId);
        });
    }
    ensureDefaultTags(taskId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultTags = ["urgent", "bug", "feature"];
            for (const tagName of defaultTags) {
                yield this.addTagToTask(taskId, { name: tagName }, userId);
            }
        });
    }
}
exports.TaskTagService = TaskTagService;
