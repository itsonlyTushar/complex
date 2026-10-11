import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const role = request.cookies.get("user_role")?.value;
    const { pathname } = request.nextUrl;

    const isProtected =
        pathname.startsWith("/sp") ||
        pathname.startsWith("/court") ||
        pathname.startsWith("/admin");

    if (!isProtected) {
        return NextResponse.next();
    }

    if (!token || !role) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const roleTargetMap: Record<string, string> = {
        SUPER_ADMIN: "/sp",
        FOOD_COURT_ADMIN: "/court",
        RESTAURANT_VENDOR: "/admin",
    };

    const targetPortal = roleTargetMap[role];

    if (!targetPortal) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (!pathname.startsWith(targetPortal)) {
        return NextResponse.redirect(new URL(targetPortal, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/sp/:path*", "/court/:path*", "/admin/:path*"],
};
