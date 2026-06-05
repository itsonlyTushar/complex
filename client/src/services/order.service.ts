import { Order, CreateOrderPayload } from "@/types/order.types";
import { getAuth } from "@/app/actions/auth";

export const addOrder = async (
    data: CreateOrderPayload,
): Promise<{ message: string; order: Order }> => {
    const response = await fetch(`http://127.0.0.1:5000/api/add-order`, {
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

export const fetchOrders = async (params?: {
    restaurantId?: string;
    tableNumber?: number;
}): Promise<{ orders: Order[] }> => {
    let token = await getAuth();

    let url = `http://127.0.0.1:5000/api/orders`;
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (params?.restaurantId && params?.tableNumber !== undefined) {
        url = `http://127.0.0.1:5000/api/public/orders?restaurantId=${params.restaurantId}&tableNumber=${params.tableNumber}`;
    } else {
        headers["Authorization"] = `Bearer ${token || ""}`;
    }

    const response = await fetch(url, {
        method: "GET",
        headers,
    });
    if (!response.ok) {
        throw new Error("failed to fetch orders");
    }
    return response.json();
};

export const cancelOrder = async (orderId: number) => {
    let token = await getAuth();
    const response = await fetch(`http://127.0.0.1:5000/api/cancel-order`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({ id: orderId }),
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to cancel order");
    }
    return response.json();
};

export const updateOrderStatus = async ({ orderId, status }: { orderId: number; status: string }) => {
    let token = await getAuth();

    const response = await fetch(`http://127.0.0.1:5000/api/status-update`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
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
    let token = await getAuth();

    const response = await fetch(`http://127.0.0.1:5000/api/payment-details`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token || ""}`,
        },
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to fetch payment details");
    }
    return response.json();
};
