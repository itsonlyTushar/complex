import { getAuth } from "@/app/actions/auth";
import { Table } from "@/types";

export const addTable = async (data: Table): Promise<Table> => {
    let token = await getAuth()
    const response = await fetch(`http://127.0.0.1:5000/api/add-table`, {
        method: "POST",
        headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(data)
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message  || "Failed to create category")

    }
    return response.json()
}

export const getTables = async (): Promise<Table[]> => {
    let token = await getAuth()
    const response = await fetch(`http://127.0.0.1:5000/api/get-tables`, {
        method: "GET",
        headers: {
            "Content-Type" : "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Failed to fetch tables")
    }
    return response.json()
}


