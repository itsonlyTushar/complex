import type { Request, Response } from "express";
import {
  addOrder,
  fetchOrdersForRestaurant,
  fetchOrdersForTable,
  updateOrderService,
  updateOrderStatusService,
  fetchPaymentDetailsForRestaurant,
} from "../../services/order.service.js";
import { refundPayment } from "../../services/payment.service.js";
import { restoreInventory } from "../../services/menu.service.js";

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
    const updatedOrder = await updateOrderStatusService(id, "CANCELLED");

    let refund = null;
    if (updatedOrder.paymentIntentId) {
      refund = await refundPayment(updatedOrder.restaurantId, updatedOrder.id);
    }

    // Restore inventory for each item in the order
    if (updatedOrder.items && updatedOrder.items.length > 0) {
      await Promise.all(
        updatedOrder.items.map((item) =>
          restoreInventory({ id: item.menuId, quantity: item.quantity })
        )
      );
    }

    res.status(200).json({
      message: "Order cancelled successfully!",
      order: updatedOrder,
      refund,
    });
  } catch (error: any) {
    res
      .status(400)
      .json({ error: error.message || "Failed to cancel order! try again please." });
  }
};

export const updateOrderStausController = async (req: Request, res: Response) => {
  try {
    const {id, status} = req.body

    const updateOrder = await updateOrderStatusService(id, status)

    res.status(200).json({
      message: 'Order Updated Successfully!',
      order: updateOrder,
    });
  } catch(error:any) {
    res.status(400).json({error: error.message})
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
    const restaurantId = (req as any).user?.restaurantId;

    if (!restaurantId) {
      return res.status(403).json({ error: "No restaurant ID found for this user." });
    }

    const data = await fetchPaymentDetailsForRestaurant(restaurantId);

    res.status(200).json(data);
  } catch (error: any) {
    res.status(400).json({ error: error.message || "Failed to fetch payment details." });
  }
};
