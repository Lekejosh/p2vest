import { Router } from "express";
import auth from "./auth.route";
import user from "./user.route";
import task from "./task.route";
import tag from "./tag.route";
import comment from "./comment.route";
import notification from "./notification.route";

const router = Router();

router.use("/auth", auth);
router.use("/users", user);
router.use("/tasks", task);
router.use("/tags", tag);
router.use("/comments", comment);
router.use("/notifications", notification);

export default router;
