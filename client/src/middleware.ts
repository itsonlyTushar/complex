import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("user_role")?.value;
    const { pathname } = request.nextUrl;

    // 1. If not logged in, redirect to login page for protected routes
    if (!token && (pathname.startsWith("/sp") || pathname.startsWith("/court") || pathname.startsWith("/admin"))) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 2. Role-Based access control mapping
    if (pathname.startsWith("/sp") && role !== "SUPER_ADMIN") {
        // Redirect non-super-admins trying to access /sp to their own portal or login
        return NextResponse.redirect(new URL(role === "FOOD_COURT_ADMIN" ? "/court" : "/admin", request.url));
    }

    if (pathname.startsWith("/court") && role !== "FOOD_COURT_ADMIN") {
        return NextResponse.redirect(new URL(role === "SUPER_ADMIN" ? "/sp" : "/admin", request.url));
    }

    if (pathname.startsWith("/admin") && role !== "RESTAURANT_VENDOR") {
        return NextResponse.redirect(new URL(role === "SUPER_ADMIN" ? "/sp" : "/court", request.url));
    }

    return NextResponse.next();
}

// Config specifies which routes the middleware runs on
export const config = {
    matcher: ["/sp/:path*", "/court/:path*", "/admin/:path*"],
};
