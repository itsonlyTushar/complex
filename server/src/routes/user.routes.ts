import { Router } from "express";
import { userController } from "../controllers/user/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/users/me", authMiddleware, userController)

export default router