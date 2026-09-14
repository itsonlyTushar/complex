import { FoodCourtItem } from "@/types/sp.types";
import { getAuth } from "@/app/actions/auth";
import { API_URL } from "@/lib/api";

export const fetchFoodCourts = async (): Promise<FoodCourtItem[]> => {
    const response = await fetch(`${API_URL}/api/auth/courts`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch food courts");
    }
    return response.json();
};

export const editFoodCourt = async ({ id, data }: { id: number; data: any }): Promise<any> => {
    const response = await fetch(`${API_URL}/api/auth/courts/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to edit food court");
    }
    return response.json();
};

export const deleteFoodCourt = async (id: number): Promise<any> => {
    const response = await fetch(`${API_URL}/api/auth/courts/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        }
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete food court");
    }
    return response.json();
};

export const fetchRestaurantsCommission = async (): Promise<any[]> => {
    const token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/restaurants-commission`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to fetch restaurant commissions");
    }
    return response.json();
};

export const updateRestaurantCommission = async ({ id, commissionRate }: { id: number; commissionRate: number }): Promise<any> => {
    const token = await getAuth();
    const response = await fetch(`${API_URL}/api/payments/restaurants-commission/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ commissionRate }),
    });
    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update restaurant commission");
    }
    return response.json();
};
