import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";

const LawyerProfile = () => {
  const { lawyerToken, profileData, setProfileData, getProfileData } = useContext(LawyerContext);
  const { backendUrl } = useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {
    if (lawyerToken) {
      getProfileData();
    }
  }, [lawyerToken]);

  return (
    <div className="p-8 w-full">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-2xl font-medium mb-6">
          ข้อมูลทนายความ
        </h1>
      </div>
      <div className="bg-[#F7F7F7] w-full max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10 rounded">
        <div className="flex items-start">
          {/* รูปโปรไฟล์ */}
          <div className="w-full">
            <div className="flex flex-col">
              <div className="flex flex-col items-center">
                <img
                  src={profileData.image}
                  alt=""
                  className="w-60 h-60 rounded object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ข้อมูลส่วนตัว */}
        <div className="w-full space-y-4">
          <div>
            <p className="text-dark-brown text-xl mb-5 mt-10">
              ข้อมูลส่วนตัว
            </p>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col w-1/2">
              <label className="mb-2 font-semibold">ชื่อจริง</label>
              <p className="border border-[#DADADA] rounded p-2 bg-white">
                {profileData.firstName}
              </p>
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-2 font-semibold">นามสกุล</label>
              <p className="border border-[#DADADA] rounded p-2 bg-white">
                {profileData.lastName}
              </p>
            </div>
          </div>

          <div className="flex gap-10">
            <div className="flex flex-col w-1/2">
              <label className="mb-2 font-semibold">วันเกิด</label>
              <p className="border border-[#DADADA] rounded p-2 bg-white">
                {profileData.dob}
              </p>
            </div>

            <div className="flex flex-col w-1/2">
              <label className="mb-2 font-semibold">เพศ</label>
              <p className="border border-[#DADADA] rounded p-2 bg-white">
                {profileData.gender === 'male' ? 'ชาย' : 'หญิง'}
              </p>
            </div>
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-2 font-semibold">เบอร์โทร</label>
            <p className="border border-[#DADADA] rounded p-2 bg-white">
              {profileData.phone}
            </p>
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-2 font-semibold">อีเมล</label>
            <p className="border border-[#DADADA] rounded p-2 bg-white">
              {profileData.email}
            </p>
          </div>
        </div>

        {/* ข้อมูลการทำงาน */}
        <div>
          <p className="text-dark-brown text-xl mb-5 mt-10">ข้อมูลการทำงาน</p>
        </div>
        <div className="mt-6 flex flex-row gap-10">
          <div className="flex flex-col w-full">
            <label className="mb-2 font-semibold">เลขที่ใบอนุญาตว่าความ</label>
            <p className="border border-[#DADADA] rounded p-2 bg-white">
              {profileData.license_number}
            </p>
          </div>

          <div className="flex flex-col w-full">
            <label className="mb-2 font-semibold">บัตรประชาชน</label>
            <p className="border border-[#DADADA] rounded p-2 bg-white">
              {profileData.lawyerNationalId}
            </p>
          </div>
        </div>

        {/* เวลาให้บริการ */}
        <div>
          <p className="text-dark-brown text-lg mb-2 mt-10">เวลาให้บริการ</p>
          <div className="space-y-4">
            {profileData.available_slots?.map((slot, index) => (
              <div key={index} className="flex gap-10">
                <div className="flex flex-col w-1/3">
                  <label className="mb-2 font-semibold">วัน</label>
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {slot.day}
                  </p>
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="mb-2 font-semibold">เวลาเริ่ม</label>
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {slot.startTime}
                  </p>
                </div>
                <div className="flex flex-col w-1/3">
                  <label className="mb-2 font-semibold">เวลาสิ้นสุด</label>
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {slot.endTime}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ความเชี่ยวชาญ */}
        <div>
          <p className="text-dark-brown text-lg mb-4 mt-10">ความเชี่ยวชาญ</p>
          <div className="flex flex-wrap gap-2">
            {profileData.speciality?.map((item, index) => (
              <span
                key={index}
                className="bg-primary text-white px-3 py-1 rounded-full text-sm"
              >
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* เนติบัณฑิต */}
        <div>
          <p className="text-dark-brown text-lg mb-4 mt-10">เนติบัณฑิต</p>
          <p className="border border-[#DADADA] rounded p-2 bg-white w-1/3">
            {profileData.is_thaibar ? 'เป็นเนติบัณฑิต' : 'ไม่เป็นเนติบัณฑิต'}
          </p>
        </div>

        {/* ประวัติการศึกษา */}
        <div>
          <p className="text-dark-brown text-lg mb-4 mt-10">ประวัติการศึกษา</p>
          <div className="space-y-6">
            {profileData.education?.map((edu, index) => (
              <div key={index} className="border border-[#DADADA] rounded p-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">ปีที่เริ่มการศึกษา</label>
                    <p>{edu.enrollmentYear}</p>
                  </div>
                  <div>
                    <label className="font-semibold">ปีที่จบการศึกษา</label>
                    <p>{edu.graduationYear}</p>
                  </div>
                  <div>
                    <label className="font-semibold">ระดับการศึกษาและสาขาวิชา</label>
                    <p>{edu.degree}</p>
                  </div>
                  <div>
                    <label className="font-semibold">สถาบันการศึกษา</label>
                    <p>{edu.institution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ประวัติการทำงาน */}
        <div>
          <p className="text-dark-brown text-lg mb-4 mt-10">ประวัติการทำงาน</p>
          <div className="space-y-6">
            {profileData.work_experience?.map((work, index) => (
              <div key={index} className="border border-[#DADADA] rounded p-4 bg-white">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-semibold">ปีที่เริ่มการทำงาน</label>
                    <p>{work.startDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold">ปีที่สิ้นสุดการทำงาน</label>
                    <p>{work.endDate}</p>
                  </div>
                  <div>
                    <label className="font-semibold">ตำแหน่ง/อาชีพ</label>
                    <p>{work.position}</p>
                  </div>
                  <div>
                    <label className="font-semibold">สถานประกอบการ</label>
                    <p>{work.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ค่าบริการและแนะนำตัว */}
        <div>
          <p className="text-dark-brown text-lg mb-4 mt-10">ค่าบริการและแนะนำตัว</p>
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">ค่าบริการ</label>
              <p className=" rounded p-2 ">
                {isEdit ? <input type="string" onChange={(e) => setProfileData(prev => ({...prev, fees_detail: e.target.value}))} value={profileData.fees_detail} /> : profileData.fees_detail} บาท/ครึ่งชม
              </p>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold">แนะนำตัว/ข้อมูลเพิ่มเติม</label>
              <p className="rounded p-2">
              {isEdit ? (
                  <textarea
                    className="w-full min-h-[100px] p-2 border border-[#DADADA] rounded"
                    onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
                    value={profileData.bio}
                  />
                ) : (
                  <p>{profileData.bio}</p>
                )}
              </p>
            </div>
          </div>
        </div>

        {
          isEdit
          ? <button onClick={() => setIsEdit(false)} className="mt-8 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">บันทึก</button>
          : <button onClick={() => setIsEdit(true)} className="mt-8 bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2">แก้ไข</button>
        }

      </div>
    </div>
  );
};

export default LawyerProfile;
