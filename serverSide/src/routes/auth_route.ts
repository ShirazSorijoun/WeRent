import express from "express";
const router = express.Router();
import authController from "../controllers/auth_controller";

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.get("/refresh", authController.refresh);

export default router;