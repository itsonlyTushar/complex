import { Router } from "express";
import { foodCourtSignUpController, loginController, signupController } from "../controllers/auth/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/signup", authMiddleware, signupController)
router.post("/new-court", foodCourtSignUpController)
router.post("/login", loginController)

export default router