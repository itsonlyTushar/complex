import { getAuth } from "@/app/actions/auth"

export const fetchCategories = async () => {
    let token = await getAuth()
    const response = await fetch(`http://127.0.0.1:5000/api/categories`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || "" }`
        }
    })
    if(!response.ok) {
        throw new Error("failed to fetch categories")
    }
    return response.json();
}

export const addCategory = async (data: { name: string }) => {
    let token = await getAuth()
    const response = await fetch(`http://127.0.0.1:5000/api/add-category`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })
    
    if(!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to create category")
    }
    return response.json();
}
