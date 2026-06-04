import { Router } from "express";
import { addCategoryController, addMenuController, deleteCategoryController, deleteMenuController, fetchCategoryController, fetchMenuController, updateCategoryController } from "../controllers/menu/menu.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-menu", authMiddleware, addMenuController);
router.get("/menus", optionalAuthMiddleware, fetchMenuController);
router.post("/add-category", authMiddleware, addCategoryController);
router.get("/categories", authMiddleware, fetchCategoryController)
router.put("/update-category", authMiddleware, updateCategoryController)
router.delete("/delete-category", authMiddleware, deleteCategoryController)
router.delete("/delete-menu", authMiddleware, deleteMenuController)

export default router;