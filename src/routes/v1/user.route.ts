import { Router } from "express";
import auth from "../../middlewares/auth.middleware";
import { ROLE } from "../../config";
import userController from "../../controllers/user.controller";

const router = Router();

router
  .route("/")
  .get(auth(ROLE.ADMIN), userController.getUsers)
  .post(auth(ROLE.ADMIN), userController.create);
router.route("/me").get(auth(ROLE.USER), userController.getMe);

export default router;
