import React from 'react'
import { Link } from 'react-router-dom'
import NavLinks from '../utils/utils'
const NavBar = () => {
  return (
    <div className='bg-slate-950 text-white flex justify-center gap-4 items-center m-auto   h-10'>
    
        
    {
        NavLinks.map((link, index) => (
            <Link key={index} to={link.path} className='hover:text-orange-500'>{link.name}</Link>
        ))
    }
    </div>
  )
}

export default NavBar
