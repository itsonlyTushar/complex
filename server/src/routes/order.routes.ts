import { Router } from "express";
import { cancelOrderController, createManualOrderController, createOrderController, fetchOrderController, fetchPublicOrdersController, updateOrderController, updateOrderStausController, fetchPaymentDetailsController } from "../controllers/order/order.controller.js";
import { authMiddleware, requireRole } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/add-order", createOrderController)
router.post("/orders/manual", authMiddleware, requireRole("RESTAURANT_VENDOR"), createManualOrderController)
router.get("/orders", authMiddleware, requireRole("RESTAURANT_VENDOR"), fetchOrderController)
router.get("/public/orders", fetchPublicOrdersController)
router.put("/update-order", authMiddleware, requireRole("RESTAURANT_VENDOR"), updateOrderController)
router.patch("/cancel-order", authMiddleware, requireRole("RESTAURANT_VENDOR"), cancelOrderController)
router.patch("/status-update", authMiddleware, requireRole("RESTAURANT_VENDOR"), updateOrderStausController)
router.get("/payment-details", authMiddleware, requireRole("RESTAURANT_VENDOR"), fetchPaymentDetailsController)
export default router