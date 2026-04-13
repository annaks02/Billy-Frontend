import React from 'react'
import { Navbar, NavbarBrand, } from "flowbite-react";

function LHeader() {
  return (
    <div>
         <Navbar fluid rounded className='bg-blue-100'>
      <NavbarBrand  >
        <img src="https://static.vecteezy.com/system/resources/thumbnails/043/987/949/small_2x/invoice-3d-icon-png.png" className="mr-3 h-6 sm:h-9" alt="Flowbite React Logo" />
        <span className="self-center whitespace-nowrap text-xl font-semibold text-blue-600">Billy</span>
      </NavbarBrand>
       
    </Navbar>
    </div>
  )
}

export default LHeader