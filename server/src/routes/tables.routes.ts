import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addTableController, fetchTablesController } from "../controllers/tables/table.controller.js";

const router = Router()

router.post("/add-table", authMiddleware, addTableController);
router.get("/get-tables", authMiddleware, fetchTablesController);


export default router
