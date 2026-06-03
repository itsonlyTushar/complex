export type UserRole = 'food_court_admin' | 'shop_owner'

export interface Profile {
    id: string
    role: UserRole
    food_court_id: string | null
    restaurant_id: string | null
}
