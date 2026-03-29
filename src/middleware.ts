import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    let supabaseResponse = NextResponse.next({ request })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    )
                    supabaseResponse = NextResponse.next({ request })
                    cookiesToSet.forEach((cookie) =>
                        supabaseResponse.cookies.set(cookie)
                    )
                }
            }
        }
    )

    // 1. Get current session
    const { data: { user } } = await supabase.auth.getUser()

    const { pathname } = request.nextUrl

    // 2. If no session and trying to access protected route → login
    if (!user && pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 3. If session exists, check role vs route
    if (user && pathname.startsWith('/dashboard')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        const roleRouteMap: Record<string, string> = {
            food_court_admin: '/dashboard/food-court',
            shop_owner: '/dashboard/shop'
        }

        if (profile?.role) {
            const correctPath = roleRouteMap[profile.role]

            // if they're on the wrong dashboard → redirect to correct one
            if (!pathname.startsWith(correctPath)) {
                return NextResponse.redirect(new URL(correctPath, request.url))
            }
        }
    }

    // 4. If logged in and hitting /login → redirect to their dashboard
    if (user && pathname === '/login') {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single()

        if (profile?.role === 'food_court_admin') {
            return NextResponse.redirect(new URL('/dashboard/food-court', request.url))
        }
        if (profile?.role === 'shop_owner') {
            return NextResponse.redirect(new URL('/dashboard/shop', request.url))
        }
    }

    return supabaseResponse
}

// which routes middleware runs on
export const config = {
    matcher: ['/dashboard/:path*', '/login']
}