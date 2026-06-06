import { getAuth } from "@/app/actions/auth";
import { Table, Line, PlacedItem } from "@/types/table.types";

export interface SaveLayoutPayload {
    walls: Line[];
    infrastructure: PlacedItem[];
    placedTables: { id: number; x: number; y: number; rotation: number }[];
}

export interface GetLayoutResponse {
    layout: {
        walls: Line[];
        infrastructure: PlacedItem[];
    } | null;
    tables: Table[];
}

export const addTable = async (data: Table): Promise<Table> => {
    let token = await getAuth()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/add-table`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/get-tables`, {
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

export const saveLayout = async (payload: SaveLayoutPayload): Promise<{ message: string }> => {
    let token = await getAuth()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/save-layout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        },
        body: JSON.stringify(payload)
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Failed to save layout")
    }
    return response.json()
}

export const getLayout = async (): Promise<GetLayoutResponse> => {
    let token = await getAuth()
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000"}/api/get-layout`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token || ""}`
        }
    })

    if(!response.ok) {
        const result = await response.json().catch(() => ({}))
        throw new Error(result.message || "Failed to fetch layout")
    }
    return response.json()
}


