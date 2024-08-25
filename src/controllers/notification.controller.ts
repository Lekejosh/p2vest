import { Request, Response } from "express";
import { NotificationService } from "../services/notification.service";
import response from "../utils/response";

class NotificationController {
  private notificationService: NotificationService;
  constructor() {
    this.notificationService = new NotificationService();
  }

  public getNotifications = async (req: Request, res: Response) => {
    const result = await this.notificationService.getNotifications(
      req.$user!.id,
    );
    return res.status(200).send(response("Notifications", result));
  };
  public getNotification = async (req: Request, res: Response) => {
    const result = await this.notificationService.getNotification(
      req.params.id,
      req.$user!.id,
    );
    return res.status(200).send(response("Notification", result));
  };
  public readNotification = async (req: Request, res: Response) => {
    const result = await this.notificationService.markAsRead(
      req.params.id,
      req.$user!.id,
    );
    return res.status(200).send(response("Notification", result));
  };
  public deleteNotification = async (req: Request, res: Response) => {
    await this.notificationService.delete(req.params.id, req.$user!.id);
    return res.status(204).end();
  };
}

export default new NotificationController();
