import React from 'react'
import {
  Footer,
  FooterBrand,
  FooterCopyright,
  FooterDivider,
  FooterIcon,
} from "flowbite-react";

import { BsDribbble, BsFacebook, BsGithub, BsInstagram, BsTwitter } from "react-icons/bs";
function LFooter() {
  return (
    <div>
        <Footer container className=' bg-blue-100 '>
      <div className="w-full">
        <FooterDivider />
        <div className="w-full sm:flex sm:items-center sm:justify-between">
          <FooterCopyright href="#" by="Billy™" year={2026} className='text-blue-600'/>
          <div className="mt-4 flex space-x-6 sm:mt-0 sm:justify-center">
            <FooterIcon href="#" icon={BsFacebook} className='text-blue-400' />
            <FooterIcon href="#" icon={BsInstagram} className='text-blue-400' />
            <FooterIcon href="#" icon={BsTwitter} className='text-blue-400'/>
            <FooterIcon href="#" icon={BsGithub} className='text-blue-400' />
            <FooterIcon href="#" icon={BsDribbble} className='text-blue-400' />
          </div>
        </div>
      </div>
    </Footer>
    </div>
  )
}

export default LFooter