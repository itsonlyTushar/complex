'use server'

import { Profile } from "@/types"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData): Promise<{ error: string } | void> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    // Temporary mock behavior without Supabase
    // Replace with custom backend logic later
    if (email === 'admin@example.com' && password === 'admin') {
        redirect('/dashboard/food-court')
    } else if (email === 'shop@example.com' && password === 'shop') {
        redirect('/dashboard/restaurant')
    }

    return { error: 'Invalid credentials. Contact Support' }
}
