import type { Request, Response } from "express";
import {
  addOrder,
  fetchOrdersForRestaurant,
  updateOrderService,
  updateOrderStatusService,
} from "../../services/order.service.js";

export const createOrderController = async (req: Request, res: Response) => {
  try {
    const orderState = req.body;

    const createdOrder = await addOrder(orderState);

    res.status(201).json({
      message: "Order placed successfully!",
      order: createdOrder,
    });
  } catch (error: any) {
    res.status(400).json({ error: "Failed to place order" });
  }
};

export const fetchOrderController = async (req: Request, res: Response) => {
  try {
    const restaurantId = (req as any).user?.restaurantId;

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
    const orderState = req.body;
    const updatedOrder = await updateOrderService(orderState);

    res.status(200).json({
      message: "Order updated successfully!",
      order: updatedOrder,
    });
  } catch (error: any) {
    res.status(400).json({ error: "Failed to update order" });
  }
};

export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { id } = req.body;
    await updateOrderStatusService(id, "CANCELLED");
  } catch (error: any) {
    res
      .status(400)
      .json({ error: "Failed to cancel order! try again please." });
  }
};
