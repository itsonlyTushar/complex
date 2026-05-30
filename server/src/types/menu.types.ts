export interface Menu {
    id: number
    image?: string
    itemName: string
    category?: string
    categoryId?: number | null
    price: number
    cost: number
    quantity: number
    description: string   
}

export interface Category {
    id: number
    name: string
}