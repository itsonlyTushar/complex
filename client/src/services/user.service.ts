import { getAuth } from "@/app/actions/auth"

const API_URL = "http://localhost:5000/api"

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
