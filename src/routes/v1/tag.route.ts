import { Router } from "express";
import taskTag from "../../controllers/taskTag.controller";
import auth from "../../middlewares/auth.middleware";
import { ROLE } from "../../config";

const router = Router();

router
  .route("/tasks/:id")
  .get(auth(ROLE.USER), taskTag.getTagsForTask)
  .put(auth(ROLE.USER), taskTag.addTagToTask)
  .delete(auth(ROLE.USER), taskTag.removeTagFromTask);
router
  .route("/tasks/:id/all")
  .delete(auth(ROLE.USER), taskTag.removeAllTagsFromTask);
export default router;
