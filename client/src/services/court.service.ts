import { getAuth } from "@/app/actions/auth"

export const fetchRestaurants = async () => {
    let token = await getAuth()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/court/restaurants`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/auth/signup`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/court/restaurants/${id}`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/court/restaurants/${id}`, {
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

export const fetchPublicRestaurantDetails = async (id: string) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"}/api/court/public/restaurant/${id}`, {
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