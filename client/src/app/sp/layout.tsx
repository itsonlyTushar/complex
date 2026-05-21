'use client'

import Link from "next/link";
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { SUP_NAV_DATA } from "@/constants/navConstants";

const SuperAdminLayout = ({ children }: { children: React.ReactNode }) => {
    const pathName = usePathname()

    return (
        <>
            <div className="min-h-screen bg-background text-foreground">
                <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                    <nav className="flex h-14 items-center justify-between px-6 max-w-7xl mx-auto">
                        <div className="font-semibold text-lg tracking-tight">
                            Super Admin Panel
                        </div>

                        <div className="flex items-center gap-6">
                            {
                                SUP_NAV_DATA.map((item) => {
                                    const Icon = item.icon
                                    const isActive = pathName === item.href
                                    return (
                                        <Link
                                            className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-foreground ${isActive ? "text-foreground" : "text-muted-foreground"
                                                }`}
                                            href={item.href}
                                            key={item.href}
                                        >
                                            <Icon className="w-4 h-4" />
                                            {item.label}
                                        </Link>
                                    )
                                })
                            }
                        </div>

                        <div className="flex items-center">
                            <ThemeToggle />
                        </div>
                    </nav>
                </header>

                <main className="max-w-7xl mx-auto py-6 px-4">
                    {children}
                </main>
            </div>
        </>
    )
}

export default SuperAdminLayout