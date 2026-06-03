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

export interface OrderItem {
    id: number
    menuID: number
    quantity: number
    price: number
    menu?: Menu
}

export interface Order {
    id:number
    userId?: number
    restaurantId: number
    totalAmount: number
    status: 'PENDING' | 'PREPARING' | 'COMPLETED' | 'CANCELLED'
    createdAt: Date
    tableName: number
    tableId: number
    items: OrderItem[] 
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


// types for the court/tables 
export interface PlacedItem {
    id: string
    type: string
    x: number
    y: number
    width: number
    height: number
    rotation?: number
}

export interface Line {
    x1: number
    y1: number
    x2: number
    y2: number
}


// types for the court to create new table

export interface Table {
    id?: number;
    foodCourtId: number;
    number: string;
    occupacy: number;
    shape: string;
    createdAt?: Date;
    updatedAt?: Date;
}