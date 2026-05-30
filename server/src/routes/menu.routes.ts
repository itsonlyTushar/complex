import { Router } from "express";
import { addCategoryController, addMenuController, fetchCategoryController, fetchMenuController, updateCategoryController } from "../controllers/menu/menu.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-menu", authMiddleware, addMenuController);
router.get("/menus", authMiddleware, fetchMenuController);
router.post("/add-category", authMiddleware, addCategoryController);
router.get("/categories", authMiddleware, fetchCategoryController)
router.put("/update-category", authMiddleware, updateCategoryController)
export default router;