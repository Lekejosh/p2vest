import { NotificationRepository } from "../repositories/notification.repository";
import { TaskRepository } from "../repositories/task.repository";
import CustomError from "../utils/custom-error";

export class NotificationService {
  private notificationRepository = new NotificationRepository();
  private taskRepository = new TaskRepository();
  public async create(userId: string, taskId: string, message: string) {
    const task = await this.taskRepository.findById(taskId);
    if (!task) throw new CustomError("Task not found", 404);
    await this.notificationRepository.create({ userId, taskId, message });
  }
  public async getNotifications(userId: string) {
    return this.notificationRepository.findByUserId(userId);
  }
  public async getNotification(id: string, userId: string) {
    const notification = await this.notificationRepository.findById(id, userId);
    if (!notification) throw new CustomError("Notification not found", 404);
    return notification;
  }
  public async markAsRead(id: string, userId: string) {
    const notification = await this.notificationRepository.findById(id, userId);
    if (!notification) throw new CustomError("Notification not found", 404);
    await this.notificationRepository.markAsRead(id, userId);
    return;
  }
  public async delete(id: string, userId: string) {
    const notification = await this.notificationRepository.findById(id, userId);
    if (!notification) throw new CustomError("Notification not found", 404);
    await this.notificationRepository.delete(id, userId);
    return;
  }
}
