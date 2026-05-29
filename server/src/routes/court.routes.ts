import { Router } from "express";
import { fetchRestaurantsController } from "../controllers/court/court.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.get("/restaurants", authMiddleware, fetchRestaurantsController)

export default router