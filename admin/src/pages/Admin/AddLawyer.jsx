import React from "react";
import { assets } from "../../assets/assets";

const AddLawyer = () => {
  return (
    <div className="bg-light-gray   w-full max-w-7xl  min-h-[800px] mt-10 mx-auto p-6">
      <div className="flex justify-center w-full">
        <h1 className="bg-primary rounded text-white text-2xl mb-6 px-4 py-2">
          ลงทะเบียนทนายความ
        </h1>
      </div>

      <form className="mt-5">
        <div className="flex justify-center gap-20">
          {/* รูป*/}
          <div className="w-1/5">
            <div className="mb-4 flex flex-col items-center">
              <label htmlFor="lawyer-img">
              <img src={assets.Myprofile} alt="" className="w-full" />
              <button className=" mt-5 py-2 px-4 border border-primary rounded-full text-primary">
                อัปโหลดรูปภาพ
              </button>
              </label>
              <input type='file' id='lawyer-img' hidden />
            </div>
          </div>

          {/* กล่องกรอกข้อมูลฟอร์ม*/}
          <div className="w-1/3 space-y-4">
            <div>
              <label className="block mb-1">ชื่อจริง</label>
              <input
                type="text"
                placeholder="ชื่อจริง"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">นามสกุล</label>
              <input
                type="text"
                placeholder="นามสกุล"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">อีเมล</label>
              <input
                type="email"
                placeholder="อีเมล"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">รหัสผ่าน</label>
              <input
                type="password"
                placeholder="รหัสผ่าน"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">เบอร์โทร</label>
              <input
                type="tel"
                placeholder="เบอร์โทร"
                className="w-3/4 border rounded p-2"
              />
            </div>
            <div>
              <label className="block mb-1">วันเกิด</label>
              <input type="date" className="w-3/4 border rounded p-2" />
            </div>
            <div>
              <label className="block mb-1">เพศ</label>
              <select className="w-3/4 border rounded p-2">
                <option value="">เลือกเพศ</option>
                <option value="male">ชาย</option>
                <option value="female">หญิง</option>
                <option value="other">อื่นๆ</option>
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
      </form>
    </div>
  );
};

export default AddLawyer;
