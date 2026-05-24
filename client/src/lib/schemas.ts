import { z } from "zod"

export const signupSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant Name is required"),
    email: z.string().email("Invalid email format"),
    ownerName: z.string().min(1, "Owner name is required"),
    location: z.string().min(1, "Location is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export const foodCourtSchema = z.object({
    foodCourtName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email format"),
    managementDetails: z.string().min(1, 'Detail is required'),
    address: z.string().min(10, "Enter Valid Address"),
    location: z.string().min(1, "Location is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
})

// menu fields schema 
export const newMenuSchema = z.object({
    image: z.string().optional(),
    itemName: z.string().min(1, "Item Name is required"),
    category: z.string().min(1, "Category is required"),
    price: z.coerce.number().positive("Price must be greater than 0"),
    cost: z.coerce.number().min(0, "Cost cannot be negative"),
    quantity: z.coerce.number().int("Quantity must be a whole number").min(0, "Quantity cannot be negative"),
    description: z.string().min(1, "Description is required"), 
})

export type SignupInput = z.infer<typeof signupSchema>;
export type FoodCourtSignUp = z.infer<typeof foodCourtSchema>;
export type MenuInput = z.infer<typeof newMenuSchema>;
