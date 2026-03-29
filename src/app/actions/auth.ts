'use server'

import { createClient } from "@/integrations/supabase/server"
import { Profile } from "@/types"
import { redirect } from "next/navigation"

export async function loginAction(formData: FormData): Promise<{ error: string } | void> {

    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
    })

    if (authError) {
        return { error: authError.message }
    }

    // get from the supbase
    const { data: profile, error: profileError } = await supabase.from('food_courts').select('role, food_court_id, shop_id').eq('id', authData.user.id).single<Profile>()

    if (profileError || !profile) {
        return { error: 'Profile not found. Contact Support' }
    }

    const roleRedirects: Record<Profile['role'], string> = {
        food_court_admin: '/dashboard/food-court',
        shop_owner: '/dashboard/restaurant'
    }

    redirect(roleRedirects[profile.role])
}


