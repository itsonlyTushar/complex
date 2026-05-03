import { Router } from "express";
import { userController } from "../controllers/user/user.controller.js";

const router = Router()

router.get("/users", userController)

export default router