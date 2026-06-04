import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { 
    addTableController, 
    fetchTablesController,
    saveLayoutController,
    fetchLayoutController
} from "../controllers/tables/table.controller.js";

const router = Router()

router.post("/add-table", authMiddleware, addTableController);
router.get("/get-tables", authMiddleware, fetchTablesController);
router.post("/save-layout", authMiddleware, saveLayoutController);
router.get("/get-layout", authMiddleware, fetchLayoutController);

export default router
