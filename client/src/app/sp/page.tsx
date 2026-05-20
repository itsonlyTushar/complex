import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

function SuperAdmin() {

    


  return (
    <>
        <nav className="m-5 flex justify-around">
            <h1>SuperAadmin Panel</h1>
            <div>
                <Link href={'/sp/new-court'}>
                    On Board Court
                </Link>
            </div>
            <div>
                <Link href={'/activity'}>
                    Activity
                </Link>
            </div>
        </nav>
       <main>

       </main>
    </>
  )
}

export default SuperAdmin