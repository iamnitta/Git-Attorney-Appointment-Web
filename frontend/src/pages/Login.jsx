import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const navigate = useNavigate();

  const [state, setState] = useState("ลงทะเบียน");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(""); 
  const [gender, setGender] = useState(""); 
  const [phone, setPhone] = useState(""); 
  const [nationalId, setNationalId] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const onSubmitHandler = async (event) => {
    //ไม่โหลดหน้าเว็บเพจซ้ำ
    event.preventDefault();

    try {
      // ลงทะเบียน

      if (state === "ลงทะเบียน") {

        const { data } = await axios.post(backendUrl + "/api/user/register", {
          firstName,
          lastName,
          email,
          password,
          confirmPassword,
          dob,
          phone: phone.replace(/-/g, ""), // ลบขีดออกก่อนส่งข้อมูล
          gender,
          nationalId: nationalId.replace(/-/g, ""),
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      } else {
        // ล็อคอิน

        const { data } = await axios.post(backendUrl + "/api/user/login", {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token]);

  // ** e.target.name ? .value
  return (
    <form
      onSubmit={onSubmitHandler}
      className="lg:min-h-auto min-h-[150vh] flex items-start justify-center bg-white px-4 sm:px-6 md:px-8 animate-fadeIn"
    >
      <div className="w-[95%] max-w-[800px] min-h-[500px] p-8  bg-[#F7F7F7] rounded-lg shadow-md mt-10">
        <p className="text-2xl font-medium text-center mb-8 bg-gradient-to-l from-dark-brown to-primary bg-clip-text text-transparent">
          {state === "ลงทะเบียน" ? "สมัครบัญชี" : "เข้าสู่ระบบ"}
        </p>

        {/* ชื่อ นามสกุล */}
        {state === "ลงทะเบียน" && (
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="w-full md:w-auto">
              <p className="mb-2 text-dark-brown">ชื่อจริง</p>
              <input
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="text"
                placeholder="ชื่อจริง"
                onChange={(e) => setFirstName(e.target.value)}
                value={firstName}
              />
            </div>

            <div className="w-full md:w-auto">
              <p className="mb-2 text-dark-brown">นามสกุล</p>
              <input
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="text"
                placeholder="นามสกุล"
                onChange={(e) => setLastName(e.target.value)}
                value={lastName}
              />
            </div>
          </div>
        )}

        {/* วันเกิด และ เพศ */}
        {state === "ลงทะเบียน" && (
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <div className="w-full md:w-auto">
              <p className="mb-2 mt-4 text-dark-brown">วันเกิด</p>
              <input
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="date"
                onChange={(e) => setDob(e.target.value)}
                value={dob}
              />
            </div>

            <div className="w-full md:w-auto">
              <p className="mb-2 lg:mt-4 text-dark-brown">เพศ</p>
              <select
                className="w-full md:w-[200px] px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                type="text"
                onChange={(e) => setGender(e.target.value)}
                value={gender}
              >
                <option value="" disabled>
                  เลือกเพศ
                </option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
              </select>
            </div>
          </div>
        )}

        {/* เบอร์โทร*/}
        {state === "ลงทะเบียน" && (
          <>
            <div className="flex justify-center">
              <div className="w-full md:w-[420px]">
                <p className="mb-2 mt-4 text-dark-brown">เบอร์โทร</p>
                <input
                  type="text"
                  maxLength={12}
                  inputMode="numeric"
                  placeholder="เบอร์โทรศัพท์ 10 หลัก"
                  className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข * อธิบายเพิ่ม \D = ทุกตัวอักษรที่ "ไม่ใช่" ตัวเลข g = ให้ทำทั้งข้อความ (ไม่ใช่แค่ตัวแรกที่เจอ) แทนที่ข้อความที่ไม่ใช่ตัวเลขด้วยช่องว่าง
                    const formattedValue = value
                      .replace(/^(\d{3})(?=\d)/, "$1-") // จับ 3 ตัวแรก
                      .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-"); // จับ 3 ตัวถัดไป
                    setPhone(formattedValue); // ใช้ setPhone เก็บค่าที่กรองแล้ว
                  }}
                  value={phone}
                />
              </div>
            </div>

            <div className="flex justify-center">
              <div className="w-full md:w-[420px]">
                <p className="mb-2 mt-4 text-dark-brown">บัตรประชาชน</p>
                <input
                  type="text"
                  maxLength={17}
                  placeholder="เลขบัตรประชาชน 13 หลัก"
                  className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ""); // กรองให้เหลือแค่ตัวเลข
                    const formattedValue = value
                      .replace(/^(\d{1})(?=\d)/, "$1-")
                      .replace(/^(\d{1}-\d{4})(?=\d)/, "$1-") // ^(\d-\d{4}) จับรูปแบบ "เลข1ตัว-เลข4ตัว" เมื่อพิมพ์ "1-2345" → กลายเป็น "1-2345-"
                      .replace(/^(\d{1}-\d{4}-\d{5})(?=\d)/, "$1-")
                      .replace(/^(\d{1}-\d{4}-\d{5}-\d{2})(?=\d)/, "$1-");
                    setNationalId(formattedValue);
                  }}
                  value={nationalId}
                />
              </div>
            </div>
          </>
        )}

        {/* อีเมล รหัสผ่าน*/}
        <div className="flex justify-center">
          <div className="w-full md:w-[420px]">
            <p className="mb-2 mt-4 text-dark-brown">อีเมล</p>
            <input
              type="text"
              placeholder="example@email.com"
              className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>
        </div>

        <div className="flex justify-center">
          <div className="w-full md:w-[420px]">
            <p className="mb-2 mt-4 text-dark-brown">รหัสผ่าน</p>
            <input
              type="password"
              className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />
          </div>
        </div>

        {state === "ลงทะเบียน" && ( <div className="flex justify-center">
          <div className="w-full md:w-[420px]">
            <p className="mb-2 mt-4 text-dark-brown">ยืนยันรหัสผ่าน</p>
            <input
              type="password"
              className="w-full px-2 py-1.5 border-[0.5px] border-slate-300 rounded-md focus:outline-none focus:border-[#A17666]"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
            />
          </div>
        </div>
        )}

        {/* ปุ่มและคำข้างล่างสุด*/}

        <div className="mt-16">
          <button
            type="submit"
            className="w-[200px] mx-auto block bg-primary hover:bg-[#8B6455] text-white py-2 rounded-full"
          >
            {state === "ลงทะเบียน" ? "สมัครบัญชี" : "เข้าสู่ระบบ"}
          </button>
          {state === "ลงทะเบียน" ? (
            <p className="text-center pt-4">
              มีบัญชีแล้ว?{" "}
              <span
                onClick={() => setState("เข้าสู่ระบบ")}
                className="text-primary cursor-pointer underline"
              >
                เข้าสู่ระบบ
              </span>
            </p>
          ) : (
            <p className="text-center pt-4">
              ต้องการสร้างบัญชีผู้ใช้งาน?{" "}
              <span
                onClick={() => setState("ลงทะเบียน")}
                className="text-primary cursor-pointer underline"
              >
                สมัครบัญชี
              </span>
            </p>
          )}
        </div>
      </div>
    </form>
  );
};

export default Login;
