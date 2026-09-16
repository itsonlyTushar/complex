import { Router } from "express";
import { 
    foodCourtSignUpController, 
    loginController, 
    signupController,
    fetchFoodCourtsController,
    editFoodCourtController,
    deleteFoodCourtController
} from "../controllers/auth/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", authMiddleware, signupController)
router.post("/new-court", foodCourtSignUpController)
router.post("/login", loginController)

router.get("/courts", fetchFoodCourtsController)
router.patch("/courts/:id", editFoodCourtController)
router.delete("/courts/:id", deleteFoodCourtController)

export default router