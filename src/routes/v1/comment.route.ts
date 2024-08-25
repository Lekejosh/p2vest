import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLE } from "../../config";
import commentController from "../../controllers/comment.controller";

const router = Router();

router
  .route("/tasks/:id")
  .post(auth(ROLE.USER), commentController.create)
  .get(auth(ROLE.USER), commentController.getComments);
router
  .route("/:id")
  .get(auth(ROLE.USER), commentController.getComment)
  .put(auth(ROLE.USER), commentController.updateComment)
  .delete(auth(ROLE.USER), commentController.delete);

export default router;
