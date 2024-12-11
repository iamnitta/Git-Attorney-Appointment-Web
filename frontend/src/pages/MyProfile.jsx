import React, { useState } from 'react'
import { assets } from '../assets/assets'

const MyProfile = () => {

  const [userData,setUserData] = useState({
    image:assets.profile_pic,
    firstName: 'ชนิษฐา',
    lastName: 'ลีวงศ์เจริญ',
    email: 'Chanitta.l@ku.th',
    phone: '000-000-0000',
    dob: '2001-03-21',
    gender: 'หญิง'
  })

  const [isEdit,setIsEdit] = useState(false)

  //ใช้ prev เพื่อนำค่าเก่าที่อยู่ใน state ทั้งหมดมาใช้ในการอัพเดื

  //ตัวอย่าง
  // {
  //   image: assets.profile_pic,    // ยังอยู่
  //   firstName: "ค่าใหม่",        // อัพเดทแค่ตรงนี้
  //   lastName: "ลีวงศ์เจริญ",     // ยังอยู่
  //   email: "Chanitta.l@ku.th",   // ยังอยู่
  //   phone: "000-000-0000",       // ยังอยู่
  //   dob: "2001-03-21",          // ยังอยู่
  //   gender: "female"            // ยังอยู่
  // }

  //value={userData.firstName} ทำให้ค่าแสดงตอนเริ่มต้น
  return (
    <div className="flex justify-center items-center min-h-screen bg-light-brown px-4">
    <div className="bg-white p-8 rounded-lg shadow-md w-[800px]">
      <h1 className="text-2xl font-bold text-center mb-8">โปรไฟล์ของฉัน</h1>
      
      <div className="flex flex-col md:flex-row gap-8 ">
        {/* left side - ไม่มีการเปลี่ยนแปลง */}
        <div className="flex flex-col items-center">
          <img 
            src={userData.image} 
            alt="Profile" 
            className="w-[150px] h-[150px] rounded-full mb-4 mr-4"
          />
        </div>

        {/* right side */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-[120px,1fr] gap-4 items-center max-w-full">
            <p className="font-semibold h-9 flex items-center">อีเมล</p>
            <p className="h-9 flex items-center">{userData.email}</p>

            <p className="font-semibold h-9 flex items-center">ชื่อจริง</p>
            {isEdit ? (
              <input 
                type="text" 
                value={userData.firstName}
                onChange={e => setUserData(prev => ({...prev, firstName: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              />
            ) : (
              <p className="h-9 flex items-center">{userData.firstName}</p>
            )}

            <p className="font-semibold h-9 flex items-center">นามสกุล</p>
            {isEdit ? (
              <input 
                type="text" 
                value={userData.lastName}
                onChange={e => setUserData(prev => ({...prev, lastName: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              />
            ) : (
              <p className="h-9 flex items-center">{userData.lastName}</p>
            )}

            <p className="font-semibold h-9 flex items-center">เบอร์โทร</p>
            {isEdit ? (
              <input 
                type="text" 
                value={userData.phone}
                onChange={e => setUserData(prev => ({...prev, phone: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              />
            ) : (
              <p className="h-9 flex items-center">{userData.phone}</p>
            )}

            <p className="font-semibold h-9 flex items-center">วันเกิด</p>
            {isEdit ? (
              <input 
                type="date"
                value={userData.dob}
                onChange={e => setUserData(prev => ({...prev, dob: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              />
            ) : (
              <p className="h-9 flex items-center">{userData.dob}</p>
            )}

            <p className="font-semibold h-9 flex items-center">เพศ</p>
            {isEdit ? (
              <select 
                value={userData.gender}
                onChange={e => setUserData(prev => ({...prev, gender: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              >
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            ) : (
              <p className="h-9 flex items-center">{userData.gender}</p>
            )}
          </div>
          
          {/* ปุ่มไม่มีการเปลี่ยนแปลง */}
          <div className="flex justify-center md:justify-start w-full">
          {isEdit ? (
            <button 
              onClick={() => setIsEdit(false)}
              className="bg-[#B08D7B] text-white text-lg px-12 py-3 rounded-full hover:bg-[#97786A] transition-colors font-semibold w-[200px]"
            >
              บันทึกข้อมูล
            </button>
          ) : (
            <button 
              onClick={() => setIsEdit(true)}
              className="bg-[#B08D7B] text-white text-lg px-12 py-3 rounded-full hover:bg-[#97786A] transition-colors font-semibold w-[200px]"
            >
              แก้ไขข้อมูล
            </button>
          )}
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default MyProfile