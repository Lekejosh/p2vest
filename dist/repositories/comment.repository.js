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
exports.CommentsRepository = void 0;
const client_1 = require("@prisma/client");
const redis_1 = __importDefault(require("../config/database/redis"));
const user_repository_1 = require("./user.repository");
class CommentsRepository {
    constructor(prismaClient) {
        this.userRepository = new user_repository_1.UserRepository();
        this.prisma = prismaClient || new client_1.PrismaClient();
        this.redis = redis_1.default;
    }
    cacheComment(id, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(`comment:${id}`, JSON.stringify(comment), "EX", 600);
        });
    }
    getCachedComment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedComment = yield this.redis.get(`comment:${id}`);
            return cachedComment ? JSON.parse(cachedComment) : null;
        });
    }
    cacheCommentsByTask(taskId, comments) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.redis.set(`comments:task:${taskId}`, JSON.stringify(comments), "EX", 600);
        });
    }
    getCachedCommentsByTask(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedComments = yield this.redis.get(`comments:task:${taskId}`);
            return cachedComments ? JSON.parse(cachedComments) : null;
        });
    }
    create(commentData) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.prisma.comment.create({
                data: {
                    taskId: commentData.taskId,
                    userId: commentData.userId,
                    content: commentData.content,
                },
            });
            yield this.redis.del(`comments:task:${commentData.taskId}`);
            yield this.cacheComment(comment.id, comment);
            return comment;
        });
    }
    update(commentId, userId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const comment = yield this.prisma.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment || comment.userId !== userId) {
                return null;
            }
            const updatedComment = yield this.prisma.comment.update({
                where: { id: commentId },
                data: { content, edited: true },
            });
            yield this.redis.del(`comment:${commentId}`);
            yield this.redis.del(`comments:task:${comment.taskId}`);
            yield this.cacheComment(updatedComment.id, updatedComment);
            return updatedComment;
        });
    }
    delete(commentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const admin = yield this.userRepository.findById(userId);
            const comment = yield this.prisma.comment.findUnique({
                where: { id: commentId },
            });
            if (!comment || (comment.userId !== userId && admin.role !== "ADMIN")) {
                throw new Error("User is not allowed to delete this comment");
            }
            yield this.prisma.comment.delete({
                where: { id: commentId },
            });
            yield this.redis.del(`comment:${commentId}`);
            yield this.redis.del(`comments:task:${comment.taskId}`);
        });
    }
    findById(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedComment = yield this.getCachedComment(commentId);
            if (cachedComment)
                return cachedComment;
            const comment = yield this.prisma.comment.findUnique({
                where: { id: commentId },
            });
            if (comment) {
                yield this.cacheComment(commentId, comment);
            }
            return comment;
        });
    }
    findByTaskId(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            const cachedComments = yield this.getCachedCommentsByTask(taskId);
            if (cachedComments)
                return cachedComments;
            const comments = yield this.prisma.comment.findMany({
                where: { taskId },
            });
            if (comments.length > 0) {
                yield this.cacheCommentsByTask(taskId, comments);
            }
            return comments;
        });
    }
}
exports.CommentsRepository = CommentsRepository;
