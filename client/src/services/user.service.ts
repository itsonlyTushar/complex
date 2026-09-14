import { getAuth } from "@/app/actions/auth"
import { API_URL as BASE_API_URL } from "@/lib/api"

const API_URL = `${BASE_API_URL}/api`

export const fetchMe = async () => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/users/me`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || "" }`
        }
    })
    if(!response.ok) {
        throw new Error("failed to fetch user details")
    }
    return response.json();
}

export const uploadLogo = async (logo: string) => {
    let token = await getAuth()

    const response = await fetch(`${API_URL}/users/update-logo`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ logo })
    })
    if(!response.ok) {
        throw new Error("Failed to upload logo")
    }
    return response.json()
}

export const updateRestaurantStatus = async (isClosed: boolean) => {
    let token = await getAuth()

    const response = await fetch(`${API_URL}/users/update-restaurant-status`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify({ isClosed })
    })
    if(!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.message || "Failed to update store status")
    }
    return response.json()
}