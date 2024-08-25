import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLE } from "../../config";
import notificationController from "../../controllers/notification.controller";

const router = Router();

router.route("/").get(auth(ROLE.USER), notificationController.getNotifications);
router
  .route("/:id")
  .get(auth(ROLE.USER), notificationController.getNotification)
  .put(auth(ROLE.USER), notificationController.readNotification)
  .delete(auth(ROLE.USER), notificationController.deleteNotification);

export default router;
