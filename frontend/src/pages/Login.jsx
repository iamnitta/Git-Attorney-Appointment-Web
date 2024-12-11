import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState("ลงทะเบียน");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const onSubmitHandler = async (event) => {
    //ไม่โหลดหนเาเว็บเพจซ้ำ
    event.preventDefault();
  };

  // ** e.target.name ? .value
  return (
    <form className="min-h-[80vh] flex items-center justify-center bg-light-brown px-4 sm:px-6 md:px-8">
      <div className="w-[95%] max-w-[800px] min-h-[500px] p-8  bg-light-gray rounded-lg shadow-md">
        <p className="text-2xl font-medium text-center mb-8 text-dark-brown">
          {state === "ลงทะเบียน" ? "สมัครบัญชี" : "เข้าสู่ระบบ"}
        </p>
        
        {/* ชื่อ นามสกุล */}
        {
          state === "ลงทะเบียน" &&
<div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="w-full md:w-auto">
              <p className="mb-2">ชื่อจริง</p>
              <input
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="text"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
                required
              />
            </div>

            <div className="w-full md:w-auto">
              <p className="mb-2">นามสกุล</p>
              <input
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="text"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
                required
              />
            </div>
        </div>
      }


        {/* อีเมล รหัสผ่าน*/}
        <div className="flex justify-center">
          <div className="w-full md:w-[420px]">
            <p className="mb-2 mt-4">อีเมล</p>
            <input
              type="text"
              className='w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]'
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required
            />
          </div>
        </div>

        <div className="flex justify-center">
        <div className="w-full md:w-[420px]">
          <p className="mb-2 mt-4">รหัสผ่าน</p>
          <input
            type="text"
            className='w-full px-3 py-2 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]'
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            required
          />
        </div>
        </div>

        {/* ปุ่มและคำข้างล่างสุด*/}

        <div className="mt-16">

        <button className='w-[200px] mx-auto block bg-[#A17666] text-white py-2 rounded-full hover:bg-[#8B6455]' >{state === "ลงทะเบียน" ? "สมัครบัญชี" : "เข้าสู่ระบบ"}</button>
        {
          state === 'ลงทะเบียน'
          ? <p className="text-center pt-4">มีบัญชีแล้ว? <span onClick={()=>setState('เข้าสู่ระบบ')} className="text-primary cursor-pointer underline">เข้าสู่ระบบ</span></p>
          : <p className="text-center pt-4">ต้องการสร้างบัญชีผู้ใช้งาน? <span onClick={()=>setState('ลงทะเบียน')} className="text-primary cursor-pointer underline">สมัครบัญชี</span></p>
        }
        </div>
      </div>
    </form>
  );
};

export default Login;
