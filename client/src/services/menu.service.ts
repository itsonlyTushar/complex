import { getAuth } from "@/app/actions/auth"
import { Category, Menu } from "@/types/menu.types"
import { API_URL } from "@/lib/api"

export const fetchCategories = async (): Promise<Category[]> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/categories`, {
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

export const addCategory = async (data: { name: string }): Promise<Category> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/add-category`, {
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

export const updateCategory = async(data: Category): Promise<Category> => {
    let token = await getAuth()

    const response = await fetch(`${API_URL}/api/update-category`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}))

        throw new Error(result.message || "Failed to update category")    
    }
    return response.json()
}

export const deleteCategory = async (data: { id: number }): Promise<Category> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/delete-category`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Failed to delete category")
    }
    return response.json()
}

export const fetchMenus = async (restaurantId?: string): Promise<Menu[]> => {
    let token = await getAuth()
    const url = restaurantId
        ? `${API_URL}/api/menus?restaurantId=${restaurantId}`
        : `${API_URL}/api/menus`;
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    })
    if (!response.ok) {
        throw new Error("failed to fetch menus")
    }
    return response.json();
}

export const addMenu = async (data: Omit<Menu, 'id'>): Promise<Menu> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/add-menu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })
    
    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to create menu item")
    }
    return response.json();
}

export const updateMenu = async (data: Menu): Promise<Menu> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/update-menu`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })

    if (!response.ok) {
        const result = await response.json().catch(() => ({}));
        throw new Error(result.message || "Failed to update menu item")
    }
    return response.json();
}

export const deleteMenu = async (data: { id: number }): Promise<{ id: number }> => {
    let token = await getAuth()
    const response = await fetch(`${API_URL}/api/delete-menu`, {
        method: "DELETE",
        headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })
    if(!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Error deleting the menu item")
    }
    return response.json()
}