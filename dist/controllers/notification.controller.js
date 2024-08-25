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
const notification_service_1 = require("../services/notification.service");
const response_1 = __importDefault(require("../utils/response"));
class NotificationController {
    constructor() {
        this.getNotifications = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notificationService.getNotifications(req.$user.id);
            return res.status(200).send((0, response_1.default)("Notifications", result));
        });
        this.getNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notificationService.getNotification(req.params.id, req.$user.id);
            return res.status(200).send((0, response_1.default)("Notification", result));
        });
        this.readNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const result = yield this.notificationService.markAsRead(req.params.id, req.$user.id);
            return res.status(200).send((0, response_1.default)("Notification", result));
        });
        this.deleteNotification = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.notificationService.delete(req.params.id, req.$user.id);
            return res.status(204).end();
        });
        this.notificationService = new notification_service_1.NotificationService();
    }
}
exports.default = new NotificationController();
