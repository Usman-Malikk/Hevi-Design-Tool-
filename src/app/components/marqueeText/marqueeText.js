import React from 'react'
import AirplanemodeActiveIcon from '@mui/icons-material/AirplanemodeActive';
import DiscountIcon from '@mui/icons-material/Discount';
function MarqueeText() {
  return (
    <marquee loop="infinite" className="marqueeText" scrollamount="7" >
    <div>
  <p><DiscountIcon/>10% OFF ON ALL CLOTHING</p>
  <p><AirplanemodeActiveIcon/>FREE DELIVERY AND RETURNS FROM $30</p>
  <p><DiscountIcon/>10% OFF ON ALL CLOTHING</p>
  <p><AirplanemodeActiveIcon/>FREE DELIVERY AND RETURNS FROM $30</p>
  <p><DiscountIcon/>10% OFF ON ALL CLOTHING</p>
  <p><AirplanemodeActiveIcon/>FREE DELIVERY AND RETURNS FROM $30</p>
  <p><DiscountIcon/>10% OFF ON ALL CLOTHING</p>
  <p><AirplanemodeActiveIcon/>FREE DELIVERY AND RETURNS FROM $30</p>
    </div>
  </marquee>
  )
}

export default MarqueeText