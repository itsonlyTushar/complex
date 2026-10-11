export type RestaurantVendor = {
    id: number;
    name: string;
    email: string;
    role?: string;
};

export type Restaurants = {
    id: string;
    name: string;
    location?: string;
    createdAt?: string;
    foodCourtId?: string;
    isClosed?: boolean;
    status?: boolean;
    onBoradingCompleted?: boolean;
    commissionRate?: number;
    description?: string | null;
    logo?: string | null;
    vendors?: RestaurantVendor[];

    // Legacy/computed dashboard fields
    date?: string;
    email?: string;
    owner?: string;
};

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
