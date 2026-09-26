'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("token");
    cookieStore.delete("user_role");
    redirect("/login")
}

export async function getAuth() {
    const cookiesStore = await cookies()
    return cookiesStore.get("token")?.value
}