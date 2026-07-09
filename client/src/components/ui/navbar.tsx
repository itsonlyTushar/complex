import React from 'react'
import Logo from './logo'

function Navbar() {
    return (
        <nav className='flex justify-between gap-2 m-3'>
            <div className=''>
                <Logo />
            </div>  
            <div className=''>
                <ul className='flex justify-between gap-10'>
                    <li>
                        Pricing
                    </li>
                    <li>
                        About
                    </li>
                    <li>
                        Login
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Navbar