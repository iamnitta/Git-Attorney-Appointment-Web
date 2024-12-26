import React, { useContext, useState } from "react";
import { AdminContext } from "../context/AdminContext";
import axios from 'axios'
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("แอดมิน");
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')

  console.log(email)

  const {setAToken,backendUrl} = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {

      if (state === 'แอดมิน') {
        
        const {data} = await axios.post(backendUrl + '/api/admin/login', {email,password})

        if (data.success) {
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
        }else{
          toast.error(data.message)
        }


      }else{

      }
      
    } catch (error) {
      
    }
  }


  return (
       // ครอบด้วย div ที่มี bg-light-brown และ min-h-screen
   <div className="min-h-screen bg-light-brown">
   <form onSubmit={onSubmitHandler} className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 md:px-8">
     {/* ลบ bg-light-brown ออกจากตรงนี้ */}
     <div className="w-[95%] max-w-[800px] min-h-[500px] p-8 bg-light-gray rounded-lg shadow-md">
       <p className="text-2xl font-medium text-center mb-8 text-dark-brown">
         เข้าสู่ระบบสำหรับ <span>{state}</span>
       </p>
       {/* อีเมล รหัสผ่าน*/}
       <div className="flex justify-center">
         <div className="w-full md:w-[420px]">
           <p className="mb-2 mt-4">อีเมล</p>
           <input
             onChange={(e)=>setEmail(e.target.value)}
             type="email"
             className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
             required
           />
         </div>
       </div>
       <div className="flex justify-center">
         <div className="w-full md:w-[420px]">
           <p className="mb-2 mt-4">รหัสผ่าน</p>
           <input
             onChange={(e)=>setPassword(e.target.value)}
             type="password"
             className="w-full px-3 py-2 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
             required
           />
         </div>
       </div>
       <div className="mt-16">
         <button className="w-[200px] mx-auto block bg-primary text-white py-2 rounded-full hover:bg-[#8B6455]">
           เข้าสู่ระบบ
         </button>
       </div>
       {
        state === 'แอดมิน'
        ? <p className="flex justify-center mt-4">สำหรับทนายความ <span className="text-primary text-center underline cursor-pointer ml-1" onClick={()=>setState('ทนายความ')}>เข้าสู่ระบบ</span></p>
        : <p className="flex justify-center mt-4">สำหรับแอดมิน <span className="text-primary text-center underline cursor-pointer ml-1" onClick={()=>setState('แอดมิน')}>เข้าสู่ระบบ</span></p>
       }
       
     </div>
   </form>
 </div>
  );
};

export default Login;
