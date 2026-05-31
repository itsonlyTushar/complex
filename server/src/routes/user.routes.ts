import { Router } from "express";
import { uploadLogoController, userController, updateRestaurantStatusController } from "../controllers/user/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/users/me", authMiddleware, userController)
router.put("/users/update-logo", authMiddleware, uploadLogoController)
router.put("/users/update-restaurant-status", authMiddleware, updateRestaurantStatusController)

export default router