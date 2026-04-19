import { ColumnDef } from "@tanstack/react-table"

export type UserRole = 'food_court_admin' | 'shop_owner'

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
    orderId: string
}

export type Menu = {
    id: string
    name: string
    category: string
    price: number
    cost?: number | null
    stock?: number | null
}

export interface Profile {
    id: string
    role: UserRole
    food_court_id: string | null
    restaurant_id: string | null
}


// to be used for the data table in Payments
export interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}
