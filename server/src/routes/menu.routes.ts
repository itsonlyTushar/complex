import { Router } from "express";
import { addMenuController, fetchMenuController } from "../controllers/menu/menu.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-menu", authMiddleware, addMenuController);
router.get("/menus", authMiddleware, fetchMenuController)

export default router;