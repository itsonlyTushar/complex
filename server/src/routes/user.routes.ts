import { Router } from "express";
import { uploadLogoController, userController } from "../controllers/user/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/users/me", authMiddleware, userController)
router.put("/users/update-logo", authMiddleware, uploadLogoController)

export default router