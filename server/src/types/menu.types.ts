export interface Menu {
    id: number
    image?: string
    itemName: string
    categoryId: number
    price: number
    cost: number
    quantity: number
    description: string   
}

export interface Category {
    id: number
    name: string
}