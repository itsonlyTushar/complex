import { FoodCourtItem } from "@/types/sp.types";

export const fetchFoodCourts = async (): Promise<FoodCourtItem[]> => {
    const response = await fetch("http://localhost:5000/api/auth/courts", {
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
    const response = await fetch(`http://localhost:5000/api/auth/courts/${id}`, {
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
    const response = await fetch(`http://localhost:5000/api/auth/courts/${id}`, {
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
