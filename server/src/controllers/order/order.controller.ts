import type { Request, Response } from "express";
import type { Order } from "../../types/order.types.js";
import {
  addOrder,
  addManualOrder,
  cancelOrderService,
  fetchOrdersForRestaurant,
  fetchOrdersForTable,
  updateOrderStatusService,
  fetchPaymentDetailsForRestaurant,
} from "../../services/order.service.js";
import { refundPayment } from "../../services/payment.service.js";
import { OrderingClosedError } from "../../services/court.service.js";
import { refundRazorpayPayment } from "../../services/razorpay.service.js";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const { restaurantId, paymentIntentId, customerName, tableNumber, items } = req.body ?? {};
    if (
      typeof restaurantId !== "string"
      || !restaurantId.trim()
      || typeof paymentIntentId !== "string"
      || !paymentIntentId.trim()
    ) {
      return res.status(400).json({ error: "Restaurant and payment details are required." });
    }

    const createdOrder = await addOrder({
      restaurantId,
      paymentIntentId,
      customerName,
      tableNumber,
      items,
    });

    res.status(201).json({
      message: "Order placed successfully!",
      order: createdOrder,
    });
  } catch (error: unknown) {
    if (error instanceof OrderingClosedError) {
      return res.status(409).json({ error: error.message });
    }
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    }
    res.status(400).json({ error: "Failed to place order" });
  }
};

export const createManualOrderController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;
    const { customerName, tableNumber, items } = req.body ?? {};
    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }
    const order = await addManualOrder({ restaurantId, customerName, tableNumber, items });
    res.status(201).json({ message: "Manual order created successfully.", order });
  } catch (error: unknown) {
    if (error instanceof OrderingClosedError) {
      return res.status(409).json({ error: error.message });
    }
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to create manual order." });
  }
};

export const fetchOrderController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    const fetchOrders = await fetchOrdersForRestaurant(restaurantId);

    res.status(200).json({
      orders: fetchOrders,
    });
  } catch (error: any) {
    res.status(400).json({ error: "Failed to fetch orders" });
  }
};

export const updateOrderController = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body ?? {};
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId || !Number.isSafeInteger(id) || !isOrderStatus(status) || status === "CANCELLED") {
      return res.status(400).json({ error: "Valid order ID and status are required." });
    }
    const updatedOrder = await updateOrderStatusService(id, status, restaurantId);

    res.status(200).json({
      message: "Order updated successfully!",
      order: updatedOrder,
    });
  } catch (error: unknown) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update order" });
  }
};

const isOrderStatus = (status: unknown): status is Order["status"] =>
  status === "PENDING" || status === "PREPARING" || status === "READY" || status === "COMPLETED" || status === "CANCELLED";

export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body ?? {};
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId || !Number.isSafeInteger(id)) {
      return res.status(400).json({ error: "A valid order ID is required." });
    }
    const { order: updatedOrder } = await cancelOrderService(id, restaurantId);

    let refund = null;
    if (updatedOrder.paymentIntentId) {
      refund = await refundPayment(updatedOrder.restaurantId, updatedOrder.id);
    } else if (updatedOrder.razorpayPaymentId) {
      refund = await refundRazorpayPayment(updatedOrder.restaurantId, updatedOrder.razorpayPaymentId);
    }

    res.status(200).json({
      message: "Order cancelled successfully!",
      order: updatedOrder,
      refund,
    });
  } catch (error: unknown) {
    res
      .status(400)
      .json({ error: error instanceof Error ? error.message : "Failed to cancel order! try again please." });
  }
};

export const updateOrderStausController = async (req: Request, res: Response) => {
  try {
    const { id, status } = req.body ?? {};
    const restaurantId = req.user?.restaurantId;
    if (!restaurantId || !Number.isSafeInteger(id) || !isOrderStatus(status) || status === "CANCELLED") {
      return res.status(400).json({ error: "Valid order ID and status are required." });
    }

    const updateOrder = await updateOrderStatusService(id, status, restaurantId);
    res.status(200).json({
      message: 'Order Updated Successfully!',
      order: updateOrder,
    });
  } catch(error: unknown) {
    res.status(400).json({ error: error instanceof Error ? error.message : "Failed to update order status." });
  }
}

export const fetchPublicOrdersController = async (req: Request, res: Response) => {
  try {
    const { restaurantId, tableNumber } = req.query;

    if (!restaurantId || !tableNumber) {
      return res.status(400).json({ error: "restaurantId and tableNumber are required." });
    }

    const parsedTableNumber = parseInt(tableNumber as string, 10);
    if (isNaN(parsedTableNumber)) {
      return res.status(400).json({ error: "Invalid tableNumber." });
    }

    const fetchOrders = await fetchOrdersForTable(restaurantId as string, parsedTableNumber);

    res.status(200).json({
      orders: fetchOrders,
    });
  } catch (error: any) {
    res.status(400).json({ error: "Failed to fetch orders" });
  }
};

export const fetchPaymentDetailsController = async (req: Request, res: Response) => {
  try {
    const restaurantId = req.user?.restaurantId;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    const data = await fetchPaymentDetailsForRestaurant(restaurantId);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to fetch payment details." });
  }
};
