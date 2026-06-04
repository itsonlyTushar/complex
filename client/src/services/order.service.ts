import { Order, CreateOrderPayload } from "@/types/order.types";

export const addOrder = async (data: CreateOrderPayload): Promise<{ message: string; order: Order }> => {
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
