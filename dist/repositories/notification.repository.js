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
exports.NotificationRepository = void 0;
const client_1 = require("@prisma/client");
const custom_error_1 = __importDefault(require("../utils/custom-error"));
class NotificationRepository {
    constructor(prismaClient) {
        this.prisma = prismaClient || new client_1.PrismaClient();
    }
    create(notificationData) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.notification.create({
                data: {
                    userId: notificationData.userId,
                    taskId: notificationData.taskId || null,
                    message: notificationData.message,
                },
            });
            return notification;
        });
    }
    markAsRead(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.notification.findUnique({
                where: { id: notificationId },
            });
            if (!notification || notification.userId !== userId) {
                return null;
            }
            const updatedNotification = yield this.prisma.notification.update({
                where: { id: notificationId },
                data: { isRead: true },
            });
            return updatedNotification;
        });
    }
    delete(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const notification = yield this.prisma.notification.findUnique({
                where: { id: notificationId },
            });
            if (!notification || notification.userId !== userId) {
                throw new custom_error_1.default("Notification not found", 404);
            }
            yield this.prisma.notification.delete({
                where: { id: notificationId },
            });
        });
    }
    findById(notificationId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.findUnique({
                where: { id: notificationId, userId: userId },
            });
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.prisma.notification.findMany({
                where: { userId },
                orderBy: { createdAt: "desc" },
            });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
