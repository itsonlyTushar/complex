import { Router } from "express";
import {
    fetchVendorDashboardController,
    fetchCourtDashboardController,
    fetchSuperAdminDashboardController,
} from "../controllers/dashboard/dashboard.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/vendor", authMiddleware, fetchVendorDashboardController);
router.get("/court", authMiddleware, fetchCourtDashboardController);
router.get("/super-admin", authMiddleware, fetchSuperAdminDashboardController);

export default router;
