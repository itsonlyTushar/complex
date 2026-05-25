import { ColumnDef } from "@tanstack/react-table"

/* Types and interface for the restaurants */

export type UserRole = 'food_court_admin' | 'shop_owner'

export type Payment = {
    id: string
    amount: number
    status: "pending" | "processing" | "success" | "failed"
    email: string
    orderId: string
}

export type Menu = {
    id: number
    image?: string
    itemName: string
    category: string
    price: number
    cost: number
    quantity: number
    description: string   
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



/* types and interface for the food court */
export type Restaurants = {
    date: string
    status: boolean
    id: string
    email: string
    owner: string
}

// types and interfaces for restaurant
export type FoodCourt = {
    foodCourtName: string
    managementDetails: string
    address: string
    location: string
    password: string
}

export type Category = {
    id: number
    name: string
    restaurantId?: number | null
}