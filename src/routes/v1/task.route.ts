import { Router } from "express";
import taskController from "../../controllers/task.controller";
import auth from "../../middlewares/auth.middleware";
import { ROLE } from "../../config";

const router = Router();

router.route("/").post(auth(ROLE.USER), taskController.create);
router
  .route("/:id")
  .get(auth(ROLE.USER), taskController.getTask)
  .put(auth(ROLE.USER), taskController.updateTask)
  .delete(auth(ROLE.USER), taskController.deleteTask);
router
  .route("/:id/assign/users")
  .put(auth(ROLE.USER), taskController.assignTask);
router.route("/assign/users/:id").get(auth(ROLE.USER), taskController.getTasks);
export default router;
