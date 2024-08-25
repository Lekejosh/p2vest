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
exports.TaskRepository = void 0;
const client_1 = require("@prisma/client");
const redis_1 = __importDefault(require("../config/database/redis"));
class TaskRepository {
    constructor() {
        this.prisma = new client_1.PrismaClient();
        this.redis = redis_1.default;
    }
    cacheTask(id, task) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(`task:${id}`, JSON.stringify(task), "EX", 600);
        });
    }
    getCachedTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTask = yield this.redis.get(`task:${id}`);
            return cachedTask ? JSON.parse(cachedTask) : null;
        });
    }
    createTask(data, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const task = yield this.prisma.task.create({
                data: {
                    title: data.title,
                    dueDate: data.dueDate,
                    status: data.status,
                    description: data.description,
                    assignedTo: data.assignedTo,
                    createdBy: userId,
                },
            });
            yield this.cacheTask(task.id, task);
            return task;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTask = yield this.getCachedTask(id);
            if (cachedTask)
                return cachedTask;
            const task = yield this.prisma.task.findUnique({
                where: { id },
                include: {
                    createdByUser: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                        },
                    },
                    assignedToUser: {
                        select: {
                            id: true,
                            email: true,
                            username: true,
                        },
                    },
                },
            });
            if (task) {
                yield this.cacheTask(id, task);
                return task;
            }
            return null;
        });
    }
    findByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedTasks = yield this.redis.get(`tasks:status:${status}`);
            if (cachedTasks)
                return JSON.parse(cachedTasks);
            const tasks = yield this.prisma.task.findMany({
                where: { status },
            });
            if (tasks.length > 0) {
                yield this.redis.set(`tasks:status:${status}`, JSON.stringify(tasks), "EX", 3600);
            }
            return tasks;
        });
    }
    updateTask(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedTask = yield this.prisma.task.update({
                where: { id },
                data,
            });
            if (updatedTask) {
                yield this.cacheTask(id, updatedTask);
                return updatedTask;
            }
            return null;
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const deletedTask = yield this.prisma.task.delete({
                where: { id },
            });
            if (deletedTask) {
                yield this.redis.del(`task:${id}`);
                return deletedTask;
            }
            return null;
        });
    }
    findTasksByUser(pagination, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dueDate, status, limit = 5 } = pagination;
            let { page = 1 } = pagination;
            const num = Number(page);
            if (Number.isNaN(num) || num <= 0) {
                page = 1;
            }
            const offset = (page - 1) * limit;
            const cacheKey = `tasks:user:${userId}:page:${page}:limit:${limit}:${status}:${dueDate}`;
            let query = {};
            if (status) {
                if (Object.values(client_1.TaskStatus).includes(status)) {
                    query = Object.assign(Object.assign({}, query), { status: status });
                }
            }
            if (dueDate) {
                const date = new Date(dueDate);
                if (date instanceof Date) {
                    query = Object.assign(Object.assign({}, query), { dueDate: date });
                }
            }
            // Check if the tasks are cached
            const cachedTasks = yield this.redis.get(cacheKey);
            // if (cachedTasks) {
            //   return JSON.parse(cachedTasks);
            // }
            query = Object.assign({ OR: [{ createdBy: userId }, { assignedTo: userId }] }, query);
            const tasks = yield this.prisma.task.findMany({
                where: query,
                include: {
                    assignedToUser: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                    createdByUser: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
                orderBy: [{ createdAt: "desc" }],
                skip: offset,
                take: Number(limit),
            });
            if (tasks.length > 0) {
                yield this.redis.set(cacheKey, JSON.stringify(tasks), "EX", 600);
            }
            const total = yield this.prisma.task.count({ where: Object.assign({}, query) });
            const totalPages = Math.ceil(total / limit);
            return {
                tasks,
                pagination: {
                    total,
                    page,
                    totalPages,
                },
            };
        });
    }
}
exports.TaskRepository = TaskRepository;
