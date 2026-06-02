import { Router } from "express";
import { fetchRestaurantsController, deleteRestaurantController, editRestaurantController } from "../controllers/court/court.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/restaurants", authMiddleware, fetchRestaurantsController)
router.patch("/restaurants/:id", authMiddleware, editRestaurantController)
router.delete("/restaurants/:id", authMiddleware, deleteRestaurantController)

export default router