import { getAuth } from "@/app/actions/auth"

export const fetchRestaurants = async () => {
    let token = await getAuth()
    const response = await fetch(`http://localhost:5000/api/court/restaurants`, {
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
    const response = await fetch(`http://localhost:5000/api/auth/signup`, {
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

export const deleteRestaurant = async (id: number) => {
    let token = await getAuth()
    const response = await fetch(`http://localhost:5000/api/court/restaurants/${id}`, {
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

export const editRestaurant = async (id: number, data: any) => {
    let token = await getAuth()
    const response = await fetch(`http://localhost:5000/api/court/restaurants/${id}`, {
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