export type Restaurants = {
    date: string
    status: boolean
    id: string
    email: string
    owner: string
}

export type FoodCourt = {
    foodCourtName: string
    managementDetails: string
    address: string
    location: string
    currancy: string
    paymentSystem: string
    password: string
}

export type PublicStall = {
    id: string
    name: string
    logo: string | null
    description: string | null
    isClosed: boolean
}

export type PublicFoodCourtResponse = {
    foodCourt: {
        id: string
        name: string
        location: string | null
        isClosed: boolean
        currancy: string
        paymentSystem: string
    }
    restaurants: PublicStall[]
}
