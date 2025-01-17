import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddLawyer = () => {
  const [lawImg, setLawImg] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true); // เริ่ม loading

    try {
      if (!lawImg) {
        return toast.error("กรุณาเลือกรูปภาพ");
      }

      //ตรวจสอบรูปแบบและความยาวของเบอร์โทร

      if (!/^\d+$/.test(phone)) {
        return toast.error("กรุณากรอกเบอร์โทรเป็นตัวเลขเท่านั้น");
      }

      if (phone.length !== 10) {
        return toast.error("กรุณากรอกเบอร์โทรให้ครบ 10 หลัก");
      }

      const formData = new FormData();

      formData.append("image", lawImg);
      formData.append("firstName", firstName);
      formData.append("lastName", lastName);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("phone", phone);
      formData.append("dob", dob);
      formData.append("gender", gender);

      formData.forEach((value, key) => {
        console.log(`${key} : ${value}`);
      });

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-lawyer",
        formData,
        { headers: { aToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setLawImg(false);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPassword("");
        setPhone("");
        setDob("");
        setGender("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error);
      console.log(error);
    } finally {
      setIsLoading(false); // จบ loading ไม่ว่าจะสำเร็จหรือไม่
    }
  };

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ลงทะเบียนทนายความ
        </h1>
      </div>
      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10 rounded">
        <form onSubmit={onSubmitHandler} className="mt-5">
          <div className="flex items-start">
            {/* รูป*/}
            <div className="w-full">
              <div className="flex flex-col">
                <label
                  htmlFor="lawyer-img"
                  className="flex flex-col items-center"
                >
                  <img
                    src={
                      lawImg ? URL.createObjectURL(lawImg) : assets.Myprofile
                    }
                    alt=""
                    className="w-60 h-60 rounded object-cover"
                  />

                  <button
                    type="button"
                    className="mt-5 py-2 px-4 border border-primary rounded-full text-primary hover:bg-primary hover:text-white"
                    onClick={() =>
                      document.getElementById("lawyer-img").click()
                    }
                  >
                    อัปโหลดรูปภาพ
                  </button>
                </label>

                <input
                  onChange={(e) => setLawImg(e.target.files[0])}
                  type="file"
                  id="lawyer-img"
                  hidden
                />
              </div>
            </div>
          </div>

          {/* กล่องกรอกข้อมูลฟอร์ม*/}
          <div className="w-full space-y-4">
            <div>
              <p className="text-dark-brown text-xl mb-5 mt-10">
                ข้อมูลส่วนตัว
              </p>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ชื่อจริง</label>
                <input
                  onChange={(e) => setFirstName(e.target.value)}
                  value={firstName}
                  type="text"
                  placeholder="ชื่อจริง"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">นามสกุล</label>
                <input
                  onChange={(e) => setLastName(e.target.value)}
                  value={lastName}
                  type="text"
                  placeholder="นามสกุล"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">วันเกิด</label>
                <input
                  onChange={(e) => setDob(e.target.value)}
                  value={dob}
                  type="date"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">เพศ</label>
                <select
                  onChange={(e) => setGender(e.target.value)}
                  value={gender}
                  className="w-full border border-[#DADADA] rounded p-2"
                >
                  <option value="" disabled>
                    เลือกเพศ
                  </option>
                  <option value="male">ชาย</option>
                  <option value="female">หญิง</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">เบอร์โทร</label>
              <input
                onChange={(e) => setPhone(e.target.value)}
                value={phone}
                type="text"
                placeholder="เบอร์โทร"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">อีเมล</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="อีเมล"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2">รหัสผ่าน</label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="รหัสผ่าน"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
          </div>

          {/* กล่องข้างล่าง*/}
          <div>
            <p className="text-dark-brown text-xl mb-5 mt-10">ข้อมูลการทำงาน</p>
          </div>
          <div className="mt-6 flex flex-row gap-10">
            <div className="flex flex-col w-full">
              <label className="mb-2">เลขที่ใบอนุญาตว่าความ</label>
              <input
                // onChange={(e) => setFirstName(e.target.value)}
                // value={firstName}
                type="text"
                placeholder="เลขที่ใบอนุญาตว่าความ"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
            <div className="flex flex-col w-full">
              <label className="mb-2">บัตรประชาชน</label>
              <input
                // onChange={(e) => setFirstName(e.target.value)}
                // value={firstName}
                type="text"
                placeholder="บัตรประชาชน"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-2 mt-10">เวลาให้บริการ</p>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col w-1/3">
              <label className="mb-2">วัน</label>
              <input
                // onChange={(e) => setDob(e.target.value)}
                // value={dob}
                type="text"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-1/3">
              <label className="mb-2">เวลาเข้างาน</label>
              <input
                // onChange={(e) => setDob(e.target.value)}
                // value={dob}
                type="time"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>

            <div className="flex flex-col w-1/3">
              <label className="mb-2">เวลาเลิกงาน</label>
              <input
                // onChange={(e) => setDob(e.target.value)}
                // value={dob}
                type="time"
                className="w-full border border-[#DADADA] rounded p-2"
              />
            </div>
          </div>

          <div className="flex items-start mt-4">
            <button
              className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
            >
              เพิ่มเวลาให้บริการ
            </button>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">ความเชี่ยวชาญ</p>
          </div>

          <div className="flex flex-wrap gap-y-4">
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายอาญา
              </label>
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายแรงงาน
              </label>
            </div>
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายยาเสพติด
              </label>
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายแพ่ง
              </label>
            </div>
            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายทรัพย์สินทางปัญญา
              </label>
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายปกครอง
              </label>
            </div>

            <div className="flex w-full">
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายผู้บริโภค
              </label>
              <label className="flex items-center w-[300px]">
                <input type="checkbox" className="mr-2" />
                กฎหมายครอบครัวและมรดก
              </label>
            </div>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">เนติบัณฑิต</p>
          </div>

          <div className="flex w-1/3">
            <label className="flex items-center w-[300px]">
              <input type="checkbox" className="mr-2" />
              เนติบัณฑิต
            </label>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ประวัติการศึกษา
            </p>
          </div>

          <div>
            <div className="flex gap-10 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ปีที่เริ่มการศึกษา</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">ปีที่จบการศึกษา</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ระดับการศึกษาและสาขาวิชา</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">สถาบันการศึกษา</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start mt-4">
            <button
              className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
            >
              เพิ่มประวัติการศึกษา
            </button>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ประวัติการทำงาน
            </p>
          </div>

          <div>
            <div className="flex gap-10 mb-4">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ปีที่เริ่มการทำงาน</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">ปีที่สิ้นสุดการทำงาน</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>

            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2">ตำแหน่ง/อาชีพ</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2">สถานประกอบการ</label>
                <input
                  // onChange={(e) => setDob(e.target.value)}
                  // value={dob}
                  type="text"
                  className="w-full border border-[#DADADA] rounded p-2"
                />
              </div>
            </div>
          </div>

          <div className="flex items-start mt-4">
            <button
              className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
            >
              เพิ่มประวัติการทำงาน
            </button>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10">
              ค่าบริการและแนะนำตัว
            </p>
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-2">ค่าบริการ</label>
            <input
              // onChange={(e) => setEmail(e.target.value)}
              // value={email}
              type="text"
              placeholder="ค่าบริการ"
              className="w-full border border-[#DADADA] rounded p-2"
            />
          </div>

          <div className="flex flex-col w-full mt-6">
            <label className="mb-2">แนะนำตัว/ข้อมูลเพิ่มเติม</label>
            <input
              // onChange={(e) => setEmail(e.target.value)}
              // value={email}
              type="text"
              placeholder="แนะนำตัว"
              className="w-full border border-[#DADADA] rounded p-2"
            />
          </div>

          {/* ปุ่มยืนยัน*/}
          <div className="flex justify-center mt-10">
            <button
              type="submit"
              className="bg-[#A3806C] text-white py-2 px-8 rounded-full hover:scale-105 transition-transform duration-200"
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
    </div>
  );
};

export default AddLawyer;
