import { Router } from "express";
import { foodCourtSignUpController, loginController, signupController } from "../controllers/auth/auth.controller.js";

const router = Router();

router.post("/signup", signupController)
router.post("/new-court", foodCourtSignUpController)
router.post("/login", loginController)

export default router