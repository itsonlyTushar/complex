import { Router } from "express";
import { fetchRestaurantsController, deleteRestaurantController, editRestaurantController, fetchPublicRestaurantsController, fetchPublicRestaurantDetailsController, getMyFoodCourtIdController, updateFoodCourtStatusController } from "../controllers/court/court.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/public/:foodCourtId/restaurants", fetchPublicRestaurantsController)
router.get("/public/restaurant/:id", fetchPublicRestaurantDetailsController)

router.get("/my-id", authMiddleware, getMyFoodCourtIdController)
router.put("/status", authMiddleware, updateFoodCourtStatusController)
router.get("/restaurants", authMiddleware, fetchRestaurantsController)
router.patch("/restaurants/:id", authMiddleware, editRestaurantController)
router.delete("/restaurants/:id", authMiddleware, deleteRestaurantController)

export default router