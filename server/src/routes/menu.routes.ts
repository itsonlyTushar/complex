import { Router } from "express";
import { addCategoryController, addMenuController, deleteCategoryController, deleteMenuController, fetchCategoryController, fetchMenuController, updateCategoryController } from "../controllers/menu/menu.controller.js";
import { authMiddleware, optionalAuthMiddleware, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/add-menu", authMiddleware, requireRole("RESTAURANT_VENDOR"), addMenuController);
router.get("/menus", optionalAuthMiddleware, fetchMenuController);
router.post("/add-category", authMiddleware, requireRole("RESTAURANT_VENDOR"), addCategoryController);
router.get("/categories", authMiddleware, requireRole("RESTAURANT_VENDOR"), fetchCategoryController)
router.put("/update-category", authMiddleware, requireRole("RESTAURANT_VENDOR"), updateCategoryController)
router.delete("/delete-category", authMiddleware, requireRole("RESTAURANT_VENDOR"), deleteCategoryController)
router.delete("/delete-menu", authMiddleware, requireRole("RESTAURANT_VENDOR"), deleteMenuController)

export default router;