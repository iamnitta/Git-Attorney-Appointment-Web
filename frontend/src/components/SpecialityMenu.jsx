import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
      <div className='flex flex-col items-center gap-4 py-16 bg-light-brown' id='speciality'>
          <h1 className='text-3xl font-medium font-prompt'>บริการปรึกษาทนายความ</h1>
          <p className='sm:w-1/3 text-center text-sm font-prompt text-dark-brown font-medium md:text-2xl'>คุณต้องการทนายความที่มีความเชี่ยวชาญทางด้านใด</p>
          
          {/* เปลี่ยนจาก flex เป็น grid และจัดให้แสดง 2 แถว */}
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4 pt-5 w-full place-items-center'>
              {specialityData.map((item,index)=>(
                  <Link className='flex flex-col items-center text-xs cursor-pointer hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/lawyers/${item.speciality}`}>
                      <img className='w-20 md:w-36 mb-3' src={item.image} alt="" />
                      <p className='font-prompt text-sm text-center'>{item.speciality}</p>
                  </Link>
              ))}
          </div>
      </div>
    )
  }
export default SpecialityMenu