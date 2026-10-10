import { Router } from "express";
import { 
    foodCourtSignUpController, 
    loginController, 
    signupController,
    fetchFoodCourtsController,
    editFoodCourtController,
    deleteFoodCourtController
} from "../controllers/auth/auth.controller.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", authMiddleware, requireRole("FOOD_COURT_ADMIN"), signupController)
router.post("/new-court", foodCourtSignUpController)
router.post("/login", loginController)

router.get("/courts", authMiddleware, requireRole("SUPER_ADMIN"), fetchFoodCourtsController)
router.patch("/courts/:id", authMiddleware, requireRole("SUPER_ADMIN"), editFoodCourtController)
router.delete("/courts/:id", authMiddleware, requireRole("SUPER_ADMIN"), deleteFoodCourtController)

export default router