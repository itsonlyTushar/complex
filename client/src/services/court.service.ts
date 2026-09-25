import { getAuth } from "@/app/actions/auth"
import { API_URL } from "@/lib/api"
import type { PublicFoodCourtResponse } from "@/types/restaurant.types"

export const fetchRestaurants = async () => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/court/restaurants`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || "" }`
        }
    })
    if(!response.ok) {
        throw new Error("failed to fethc restaurants")
    }
    return response.json();
}

export const onboardRestaurant = async (data: any) => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })
    
    if(!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to onboard restaurant")
    }
    return response.json();
}

export const deleteRestaurant = async (id: string) => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/court/restaurants/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    })
    
    if(!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to delete restaurant")
    }
    return response.json();
}

export const editRestaurant = async (id: string, data: any) => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/court/restaurants/${id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })
    
    if(!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to edit restaurant")
    }
    return response.json();
}

export const updateFoodCourtStatus = async (isClosed: boolean) => {
    const token = await getAuth()
    const response = await fetch(`${API_URL}/api/court/status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ isClosed })
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to update food court status")
    }
    return response.json();
}

export const fetchPublicFoodCourt = async (foodCourtId: string, tableId?: string | null): Promise<PublicFoodCourtResponse> => {
    const url = new URL(`${API_URL}/api/court/public/${foodCourtId}/restaurants`);
    if (tableId) {
        url.searchParams.append("tableId", tableId);
    }

    const response = await fetch(url.toString());
    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to load this food court");
    }
    return response.json();
}

export const fetchPublicRestaurantDetails = async (id: string) => {
    const response = await fetch(`${API_URL}/api/court/public/restaurant/${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
    if(!response.ok) {
        throw new Error("failed to fetch restaurant details");
    }
    return response.json();
}

export const fetchMyCourtId = async () => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/court/my-id`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    });
    if(!response.ok) {
        throw new Error("failed to fetch food court ID");
    }
    return response.json();
}