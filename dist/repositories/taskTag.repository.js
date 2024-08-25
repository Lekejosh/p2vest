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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskTagRepository = void 0;
const client_1 = require("@prisma/client");
class TaskTagRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
    }
    addTagToTask(taskId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.taskTag.create({
                data: {
                    taskId,
                    tagId,
                },
            });
        });
    }
    getATask(taskId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.taskTag.findFirst({
                where: {
                    taskId,
                    tagId,
                },
            });
        });
    }
    removeTagFromTask(taskId, tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.taskTag.delete({
                where: {
                    taskId_tagId: {
                        taskId,
                        tagId,
                    },
                },
            });
        });
    }
    getTagsForTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskTags = yield this.prisma.taskTag.findMany({
                where: { taskId },
                include: {
                    tag: true,
                },
            });
            return taskTags.map((taskTag) => taskTag.tag);
        });
    }
    getTasksForTag(tagId) {
        return __awaiter(this, void 0, void 0, function* () {
            const taskTags = yield this.prisma.taskTag.findMany({
                where: { tagId },
                include: {
                    task: true,
                },
            });
            return taskTags.map((taskTag) => taskTag.task);
        });
    }
    removeAllTagsFromTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.prisma.taskTag.deleteMany({
                where: { taskId },
            });
        });
    }
}
exports.TaskTagRepository = TaskTagRepository;
