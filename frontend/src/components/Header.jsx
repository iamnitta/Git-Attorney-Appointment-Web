import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-gray rounded-lg px-6 md:px-10 lg:px-20 '>

      {/*Left side*/}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-dark-brown font-semibold font-prompt leading-tight md:leading-tight lg:leading-tight'>
          ปรึกษาทนายความ
        </p>
        <p className='text-1xl md:text-1xl lg:text-2xl text-dark-brown font-semibold font-prompt leading-tight md:leading-tight lg:leading-tight'>
          ให้คำปรึกษาทุกเรื่องด้านกฎหมาย <br /> จากทีมผู้เชี่ยวชาญหลากหลายสาขา
        </p>

        <br />
        <a href='' className='flex items-center gap-2 bg-primary px-8 py-3 rounded-full text-white font-semibold font-prompt  m-auto md:m-0 hover:scale-105 transition-all duration-300'>
          จองเวลานัดหมาย <img className='w-3' src={assets.arrow_icon} alt="" />
        </a> 
      </div>

      {/*Right side*/}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.HomePage} alt="" />
      </div>

    </div>
  )
}

export default Header