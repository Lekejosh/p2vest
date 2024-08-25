import { PrismaClient, Notification } from "@prisma/client";
import CustomError from "../utils/custom-error";

export interface INotificationRepository {
  create(notificationData: {
    userId: string;
    taskId?: string;
    message: string;
  }): Promise<Notification>;

  markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null>;

  delete(notificationId: string, userId: string): Promise<void>;

  findById(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null>;

  findByUserId(userId: string): Promise<Notification[]>;
}

export class NotificationRepository implements INotificationRepository {
  private prisma: PrismaClient;

  constructor(prismaClient?: PrismaClient) {
    this.prisma = prismaClient || new PrismaClient();
  }

  public async create(notificationData: {
    userId: string;
    taskId?: string;
    message: string;
  }): Promise<Notification> {
    const notification = await this.prisma.notification.create({
      data: {
        userId: notificationData.userId,
        taskId: notificationData.taskId || null,
        message: notificationData.message,
      },
    });
    return notification;
  }

  public async markAsRead(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      return null;
    }

    const updatedNotification = await this.prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true },
    });

    return updatedNotification;
  }

  public async delete(notificationId: string, userId: string): Promise<void> {
    const notification = await this.prisma.notification.findUnique({
      where: { id: notificationId },
    });

    if (!notification || notification.userId !== userId) {
      throw new CustomError("Notification not found", 404);
    }

    await this.prisma.notification.delete({
      where: { id: notificationId },
    });
  }

  public async findById(
    notificationId: string,
    userId: string,
  ): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: { id: notificationId, userId: userId },
    });
  }

  public async findByUserId(userId: string): Promise<Notification[]> {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
  }
}
