import React, { useContext } from 'react'
import {AppContext} from '../context/AppContext'

const MyAppointments = () => {

  const {lawyers} = useContext(AppContext)
  return (
    <div className="bg-light-brown p-4 md:p-6">
      <p className="bg-primary text-white rounded-full text-lg md:text-xl  font-medium mb-4 md:mb-6 px-4 md:px-6 py-2 w-fit">การนัดหมายของฉัน</p>

      <div className="space-y-4">
        {lawyers.slice(0, 2).map((item, index) => (
          <div key={index} className="bg-white rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6 shadow-sm">
            <div className="bg-brown-lawyerpic rounded-full w-24 md:w-32 h-24 md:h-32 mx-auto md:mx-0">
              <img src={item.image} alt="" className="w-full h-full rounded-full object-cover bg-gray-200" />
            </div>

            <div className="flex-1 w-full md:w-auto">
              <div className="flex flex-col md:flex-row gap-2 items-start md:items-center mb-2">
                <p className="text-lg font-medium">{item.name}</p>
                <span className="bg-brown-lawyerpic px-3 py-1 rounded-md text-sm">{item.speciality}</span>
              </div>
              <div className="space-y-1 text-gray-600">
                <p>20/01/2024</p>
                <p>8.30</p>
                <p className="text-sm md:text-base">สำนักกฎหมายทนายนอร์ท ตำบลทับมา อำเภอเมือง จังหวัดระยอง 21000</p>
              </div>
            </div>

            <div className='flex flex-col items-center md:items-end gap-4 md:gap-12 w-full md:w-auto mt-4 md:mt-0'>
              <span className="text-primary font-medium px-3 py-1 rounded-md text-sm">รอการยืนยัน</span>
              <button className="w-full md:w-auto px-4 py-2 bg-[#A17F6B] text-white rounded-full hover:bg-[#8B6B59] transition">
                ยกเลิกการนัดหมาย
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments