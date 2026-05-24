// For Restaurant 
export interface SignupInput {
    restaurantName: string;
    location: string;
    ownerName: string;
    email: string
    password: string;
}

// For Food Court
export interface FoodCourtSignUp {
    foodCourtName: string
    email: string
    managementDetails: string
    address: string
    location: string
    password: string
}

export interface LoginInput {
    email: string
    password: string
}