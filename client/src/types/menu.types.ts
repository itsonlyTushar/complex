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

export type Category = {
    id: number
    name: string
    restaurantId?: number | null
}
