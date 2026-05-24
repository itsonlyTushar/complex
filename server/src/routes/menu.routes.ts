import { Router } from "express";
import { addMenuController } from "../controllers/menu/menu.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-menu", authMiddleware, addMenuController);

export default router;