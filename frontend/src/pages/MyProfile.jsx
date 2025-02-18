import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("firstName", userData.firstName);
      formData.append("lastName", userData.lastName);
      formData.append("dob", userData.dob);
      formData.append("phone", userData.phone.replace(/-/g, ""));
      formData.append("gender", userData.gender);
      // formData.append('nationalId',userData.nationalId)

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };
  //ใช้ prev เพื่อนำค่าเก่าที่อยู่ใน state ทั้งหมดมาใช้ในการอัพเดท

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
    userData && (
      <div className="flex justify-center items-center min-h-screen bg-white px-4 animate-fadeIn">
        <div className="bg-light-brown p-8 rounded-lg shadow-md w-[800px] mb-10">
          <h1 className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-dark-brown to-primary bg-clip-text text-transparent">
            โปรไฟล์ของฉัน
          </h1>

          <div className="flex flex-col md:flex-row gap-8 ">
            {/* left side - ไม่มีการเปลี่ยนแปลง */}
            <div className="flex flex-col items-center">
              {isEdit ? (
                <label htmlFor="image">
                  <div className="relative w-[150px] h-[150px] mb-4 mr-4 cursor-pointer">
                    <img
                      className="w-full h-full rounded-full opacity-50 object-cover"
                      src={image ? URL.createObjectURL(image) : userData.image}
                      alt=""
                    />
                    {!image && (
                      <img
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 object-cover"
                        src={assets.Upload_Icon1}
                        alt=""
                      />
                    )}
                  </div>
                  <input
                    onChange={(e) => setImage(e.target.files[0])}
                    type="file"
                    id="image"
                    hidden
                  />
                </label>
              ) : (
                <img
                  src={userData.image}
                  alt="Profile"
                  className="w-[150px] h-[150px] rounded-full mb-4 mr-4 object-cover"
                />
              )}
            </div>

            {/* right side */}
            <div className="flex-1 space-y-6">
              <div className="grid grid-cols-[160px,1fr] gap-4 items-center max-w-full">
                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  อีเมล
                </p>
                <p className="h-9 flex items-center">{userData.email}</p>

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  บัตรประชาชน
                </p>
                <p className="h-9 flex items-center">
                  {userData.nationalId
                    .replace(/^(\d{1})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4}-\d{5})(?=\d)/, "$1-")
                    .replace(/^(\d{1}-\d{4}-\d{5}-\d{2})(?=\d)/, "$1-")}
                </p>

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  ชื่อจริง
                </p>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        firstName: e.target.value,
                      }))
                    }
                    className="border rounded px-2 h-9 w-full"
                  />
                ) : (
                  <p className="h-9 flex items-center">{userData.firstName}</p>
                )}

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  นามสกุล
                </p>
                {isEdit ? (
                  <input
                    type="text"
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        lastName: e.target.value,
                      }))
                    }
                    className="border rounded px-2 h-9 w-full"
                  />
                ) : (
                  <p className="h-9 flex items-center">{userData.lastName}</p>
                )}

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  เบอร์โทร
                </p>
                {isEdit ? (
                  <input
                    type="text"
                    maxLength={12}
                    inputMode="numeric"
                    value={userData.phone}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      const formattedValue = value
                        .replace(/^(\d{3})(?=\d)/, "$1-")
                        .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-");
                      setUserData((prev) => ({
                        ...prev,
                        phone: formattedValue,
                      }));
                    }}
                    className="border rounded px-2 h-9 w-full"
                  />
                ) : (
                  <p className="h-9 flex items-center">
                    {userData.phone
                      .replace(/^(\d{3})(?=\d)/, "$1-")
                      .replace(/^(\d{3}-\d{3})(?=\d)/, "$1-")}
                  </p>
                )}

                {/* <p className="font-semibold h-9 flex items-center">บัตรประชาชน</p>
            {isEdit ? (
              <input 
                type="text" 
                value={userData.nationalId}
                onChange={e => setUserData(prev => ({...prev, nationalId: e.target.value}))}
                className="border rounded px-2 h-9 w-full"
              />
            ) : (
              <p className="h-9 flex items-center">{userData.nationalId}</p>
            )} */}

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  วันเกิด
                </p>
                {isEdit ? (
                  <input
                    type="date"
                    value={userData.dob}
                    onChange={(e) =>
                      setUserData((prev) => ({ ...prev, dob: e.target.value }))
                    }
                    className="border rounded px-2 h-9 w-full"
                  />
                ) : (
                  <p className="h-9 flex items-center">{userData.dob}</p>
                )}

                <p className="font-semibold h-9 flex items-center text-dark-brown">
                  เพศ
                </p>
                {isEdit ? (
                  <select
                    value={userData.gender}
                    onChange={(e) =>
                      setUserData((prev) => ({
                        ...prev,
                        gender: e.target.value,
                      }))
                    }
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
                    onClick={updateUserProfileData}
                    className="bg-primary hover:bg-[#8B6455] text-white text-base px-10 py-2 rounded-full transition-colors font-semibold"
                  >
                    บันทึกข้อมูล
                  </button>
                ) : (
                  <button
                    onClick={() => setIsEdit(true)}
                    className="bg-primary hover:bg-[#8B6455] text-white text-base px-10 py-2 rounded-full transition-colors font-semibold"
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
  );
};

export default MyProfile;
