'use server'

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function logout() {
    const cookieStore = await cookies()
    cookieStore.delete("token");
    cookieStore.delete("user_role");
    cookieStore.delete("is_guest");
    redirect("/login")
}

export async function getAuth() {
    const cookiesStore = await cookies()
    return cookiesStore.get("token")?.value
}

export async function isGuestAuth() {
    const cookieStore = await cookies()
    const isGuest = cookieStore.get("is_guest")?.value === "true";
    const token = cookieStore.get("token")?.value;
    return isGuest || Boolean(token?.startsWith("guest_"));
}