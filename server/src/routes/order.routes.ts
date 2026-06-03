import { Router } from "express";
import { cancelOrderController, createOrderController, fetchOrderController, updateOrderController } from "../controllers/order/order.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = Router()

router.post("/add-order", createOrderController)
router.get("/orders", fetchOrderController)
router.put("/update-order", authMiddleware,updateOrderController)
router.put("/cancel-order", authMiddleware, cancelOrderController)

export default router