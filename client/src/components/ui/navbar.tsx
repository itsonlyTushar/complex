import React from 'react'
import Link from 'next/link'
import Logo from './logo'
import { ThemeToggle } from './theme-toggle'
import { Button } from './button'

function Navbar() {
    return (
        <nav className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between relative z-50">
            <div className="flex items-center">
                <Link href="/" className="transition-opacity hover:opacity-90">
                    <Logo className="h-11 md:h-12 w-auto object-contain" />
                </Link>
            </div>  
            <div className="flex items-center gap-6">
                <ul className="hidden md:flex items-center gap-8 text-sm font-medium text-white/80">
                    <li>
                        <Link href="#pricing" className="transition-colors hover:text-white">
                            Pricing
                        </Link>
                    </li>
                    <li>
                        <Link href="#about" className="transition-colors hover:text-white">
                            About
                        </Link>
                    </li>
                </ul>
                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <Button asChild variant="outline" size="sm" className="hidden sm:inline-flex border-white/20 text-white hover:bg-white/10 hover:text-white">
                        <Link href="/login">Login</Link>
                    </Button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar