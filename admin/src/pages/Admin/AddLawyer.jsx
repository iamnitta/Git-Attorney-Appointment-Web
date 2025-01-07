import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import {toast} from 'react-toastify'
import axios from 'axios'

const AddLawyer = () => {

  const [lawImg, setLawImg] = useState(false)
  const [firstName,setFirstName] = useState('')
  const [lastName,setLastName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [phone,setPhone] = useState('')
  const [dob,setDob] = useState('')
  const [gender,setGender] = useState('')

  const [isLoading, setIsLoading] = useState(false)

  const {backendUrl, aToken} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()
    setIsLoading(true) // เริ่ม loading

    try {
      if(!lawImg) {
        return toast.error('กรุณาเลือกรูปภาพ')
      }

      //ตรวจสอบรูปแบบและความยาวของเบอร์โทร
      
      if(!/^\d+$/.test(phone)) {
        return toast.error('กรุณากรอกเบอร์โทรเป็นตัวเลขเท่านั้น')
      }

      if(phone.length !== 10) {
        return toast.error('กรุณากรอกเบอร์โทรให้ครบ 10 หลัก')
      }


      const formData = new FormData()

      formData.append('image',lawImg)
      formData.append('firstName',firstName)
      formData.append('lastName',lastName)
      formData.append('email',email)
      formData.append('password',password)
      formData.append('phone',phone)
      formData.append('dob',dob)
      formData.append('gender',gender)

      formData.forEach((value,key)=>{
        console.log(`${key} : ${value}`);
      })

      const {data} = await axios.post(backendUrl + '/api/admin/add-lawyer',formData, {headers: { aToken }})

      if(data.success) {
        toast.success(data.message)
        setLawImg(false)
        setFirstName('')
        setLastName('')
        setEmail('')
        setPassword('')
        setPhone('')
        setDob('')
        setGender('')

      }else{
        toast.error(data.message)
      }

      
    } catch (error) {
      toast.error(error)
      console.log(error)
      
    }finally {
      setIsLoading(false) // จบ loading ไม่ว่าจะสำเร็จหรือไม่
    }
  }

  return (
    <div className="bg-light-gray   w-full max-w-7xl  min-h-[800px] mt-10 mx-auto p-6">
      <div className="flex justify-center w-full">
        <h1 className="bg-primary rounded text-white text-2xl mb-6 px-4 py-2">
          ลงทะเบียนทนายความ
        </h1>
      </div>

      <form onSubmit={onSubmitHandler} className="mt-5">
        <div className="flex justify-center gap-20">
          {/* รูป*/}
          <div className="w-1/5">
            <div className="mb-4 flex flex-col items-center">

              <label htmlFor="lawyer-img">
              <img src={lawImg ? URL.createObjectURL(lawImg) : assets.Myprofile} alt="" className="w-32 h-32 rounded-full object-cover" />

              <button 
              type="button" 
              className="mt-5 py-2 px-4 border border-primary rounded-full text-primary"
              onClick={() => document.getElementById('lawyer-img').click()}
              >
                อัปโหลดรูปภาพ
              </button>

              </label>

              <input onChange={(e)=> setLawImg(e.target.files[0])} type='file' id='lawyer-img' hidden />
            </div>
          </div>

          {/* กล่องกรอกข้อมูลฟอร์ม*/}
          <div className="w-1/3 space-y-4">
            <div>
              <label className="block mb-1">ชื่อจริง</label>
              <input
                onChange={(e)=>setFirstName(e.target.value)} value={firstName}
                type="text"
                placeholder="ชื่อจริง"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">นามสกุล</label>
              <input
                onChange={(e)=>setLastName(e.target.value)} value={lastName}
                type="text"
                placeholder="นามสกุล"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">อีเมล</label>
              <input
                onChange={(e)=>setEmail(e.target.value)} value={email}
                type="email"
                placeholder="อีเมล"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">รหัสผ่าน</label>
              <input
                onChange={(e)=>setPassword(e.target.value)} value={password}
                type="password"
                placeholder="รหัสผ่าน"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">เบอร์โทร</label>
              <input
                onChange={(e)=>setPhone(e.target.value)} value={phone}
                type="text"
                placeholder="เบอร์โทร"
                className="w-3/4 border rounded p-2"
              />
            </div>

            <div>
              <label className="block mb-1">วันเกิด</label>
              <input onChange={(e)=>setDob(e.target.value)} value={dob} type="date" className="w-3/4 border rounded p-2" />
            </div>

            <div>
              <label className="block mb-1">เพศ</label>
              <select 
              onChange={(e)=>setGender(e.target.value)} 
              value={gender} 
              className="w-3/4 border rounded p-2">
                <option value="" disabled selected>เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
              </select>
            </div>

          </div>
        </div>

        {/* ปุ่มยืนยัน*/}
        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="bg-[#A68B7C] text-white py-2 px-8 rounded-full hover:bg-[#95796B] transition duration-200"
          >
            ลงทะเบียน
          </button>
        </div>

        {/* Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-gray-600">กำลังบันทึกข้อมูล...</p>
          </div>
        </div>
      )}
      
      </form>
    </div>
  );
};

export default AddLawyer;
