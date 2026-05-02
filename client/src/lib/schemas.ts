import { z } from "zod"

export const signupSchema = z.object({
    restaurantName: z.string().min(1, "Restaurant Name is required"),
    email: z.string().email("Invalid email format"),
    ownerName: z.string().min(1, "Owner name is required"),
    location: z.string().min(1, "Location is required"),
    password: z.string().min(6, "Password must be at least 6 characters")
});

export type SignupInput = z.infer<typeof signupSchema>;
