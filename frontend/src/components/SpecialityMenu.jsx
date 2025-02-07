import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
      <div className='flex flex-col items-center gap-4 py-16 bg-white' id='speciality'>
          <h1 className='text-2xl font-medium font-prompt'>บริการปรึกษาทนายความ</h1>
          <p className='sm:w-2/3 text-center text-sm font-prompt text-dark-brown font-medium md:text-xl'>คุณต้องการทนายความที่มีความเชี่ยวชาญทางด้านใด</p>
        
          <div className='grid grid-cols-2 md:grid-cols-3 gap-10 pt-5 w-full place-items-center items-start'>
              {specialityData.map((item,index)=>(
                  <Link className='flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/lawyers/${item.speciality}`}>
                      <img className='w-20 md:w-36 mb-3' src={item.image} alt="" />
                      <p className='font-prompt md:text-lg text-sm text-center text-dark-brown w-40 flex items-center justify-center h-full self-start'>{item.speciality}</p>
                  </Link>
              ))}
          </div>
      </div>
    )
  }
export default SpecialityMenu