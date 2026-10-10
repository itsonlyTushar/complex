export type Menu = {
    id: number
    image?: string
    itemName: string
    category?: string
    categoryId?: number
    price: number
    cost: number
    quantity: number
    description: string
    restaurantId?: string | null
}

export type Category = {
    id: number
    name: string
    restaurantId?: string | null
}
