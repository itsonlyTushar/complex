import { Order, CreateManualOrderPayload, CreateOrderPayload } from "@/types/order.types";
import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";
import {
  GUEST_ORDERS,
  GUEST_PAYMENT_DETAILS,
  isGuestSession,
} from "@/lib/guest-data";

export const addOrder = async (
  data: CreateOrderPayload,
): Promise<{ message: string; order: Order }> => {
  const response = await fetch(`${API_URL}/api/add-order`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to place order");
  }

  return response.json();
};

export const createManualOrder = async (
  data: CreateManualOrderPayload,
): Promise<{ message: string; order: Order }> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const mockOrder: Order = {
      id: Math.floor(Math.random() * 900) + 100,
      tableNumber: data.tableNumber,
      totalAmount: data.items.reduce((s, i) => s + i.price * i.quantity, 0),
      status: "PENDING",
      customerName: data.customerName || "Walk-in Guest",
      createdAt: new Date().toISOString(),
      restaurantId: "demo-stall-1",
      items: data.items.map((it, idx) => ({
        id: idx + 100,
        quantity: it.quantity,
        price: it.price,
        orderId: 999,
        menuId: it.menuId,
        menu: {
          id: it.menuId,
          itemName: `Item #${it.menuId}`,
          image: "",
          price: it.price,
          cost: 0,
          quantity: 10,
          description: "",
        },
      })),
    };
    GUEST_ORDERS.unshift(mockOrder);
    return { message: "Manual order created (demo)", order: mockOrder };
  }

  const response = await fetch(`${API_URL}/api/orders/manual`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (token || ""),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create manual order");
  }

  return response.json();
};

export const fetchOrders = async (params?: {
  restaurantId?: string;
  tableNumber?: number;
}): Promise<{ orders: Order[] }> => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return { orders: GUEST_ORDERS };
  }

  let url = `${API_URL}/api/orders`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (params?.restaurantId && params?.tableNumber !== undefined) {
    url = `${API_URL}/api/public/orders?restaurantId=${params.restaurantId}&tableNumber=${params.tableNumber}`;
  } else {
    headers["Authorization"] = "Bearer " + (token || "");
  }

  const response = await fetch(url, {
    method: "GET",
    headers,
  });
  if (!response.ok) {
    if (isGuest) {
      return { orders: GUEST_ORDERS };
    }
    throw new Error("failed to fetch orders");
  }
  return response.json();
};

export const cancelOrder = async (orderId: number) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const target = GUEST_ORDERS.find((o) => o.id === orderId);
    if (target) target.status = "CANCELLED";
    return { message: "Order cancelled (demo)" };
  }

  const response = await fetch(`${API_URL}/api/cancel-order`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (token || ""),
    },
    body: JSON.stringify({ id: orderId }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to cancel order");
  }
  return response.json();
};

export const updateOrderStatus = async ({
  orderId,
  status,
}: {
  orderId: number;
  status: string;
}) => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    const target = GUEST_ORDERS.find((o) => o.id === orderId);
    if (target) target.status = status;
    return { message: "Order status updated (demo)" };
  }

  const response = await fetch(`${API_URL}/api/status-update`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (token || ""),
    },
    body: JSON.stringify({ id: orderId, status }),
  });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update order status");
  }
  return response.json();
};

export const fetchPaymentDetails = async () => {
  const token = await getAuth();
  const isGuest = token?.startsWith("guest_") || isGuestSession();
  if (isGuest) {
    return GUEST_PAYMENT_DETAILS;
  }

  const response = await fetch(`${API_URL}/api/payment-details`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + (token || ""),
    },
  });
  if (!response.ok) {
    if (isGuest) {
      return GUEST_PAYMENT_DETAILS;
    }
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch payment details");
  }
  return response.json();
};
