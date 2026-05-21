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

export type SignupInput = z.infer<typeof signupSchema>;
export type FoodCourtSignUp = z.infer<typeof foodCourtSchema>;
