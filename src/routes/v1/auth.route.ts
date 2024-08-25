import { Router } from "express";
import authenticationController from "../../controllers/authentication.controller";

const router = Router();

router.route("/").post(authenticationController.register);
router.route("/login").post(authenticationController.login);
router.route("/tokens/refresh").get(authenticationController.refreshToken);
export default router;
