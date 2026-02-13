// import { Navbar } from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Navbar } from '@/components/layout/Navbar'
import React from 'react'

export default function CommonLayout({
    children,
}: {
    children: React.ReactNode
}) {
  return (
    <div>
        <p> This is root layout</p>
        
        <Navbar></Navbar>
        <Footer></Footer>
        {children}
      
    </div>
  )
}
