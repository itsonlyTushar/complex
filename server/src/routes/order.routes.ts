import { Router } from "express";
import { cancelOrderController, createOrderController, fetchOrderController, fetchPublicOrdersController, updateOrderController, updateOrderStausController } from "../controllers/order/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/add-order", createOrderController)
router.get("/orders", authMiddleware, fetchOrderController)
router.get("/public/orders", fetchPublicOrdersController)
router.put("/update-order", authMiddleware,updateOrderController)
router.patch("/cancel-order", authMiddleware, cancelOrderController)
router.patch("/status-update", authMiddleware, updateOrderStausController)
export default router