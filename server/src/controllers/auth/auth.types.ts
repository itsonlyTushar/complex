
export interface SignupInput {
    restaurantName: string;
    location: string;
    ownerName: string;
    email: string
    password: string;
}


export interface LoginInput {
    email: string
    password: string
}