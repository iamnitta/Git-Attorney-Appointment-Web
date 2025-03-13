import React from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext";
import { useEffect } from "react";
import { useState } from "react";

const AboutLawyer = () => {
  const { lawId } = useParams();
  const { getAllLawyers, lawyers } = useContext(AdminContext);
  const [lawyerData, setLawyerData] = useState(null);

  useEffect(() => {
    getAllLawyers();
  }, []);

  // ถ้ามีข้อมูลทนายให้เทียบ lawyers ใน context กับ lawId ที่ส่งมาถ้าค่าอันไหนที่ตรงกันเอาข้อมูลของทนายคนนั้น
  useEffect(() => {
    if (lawyers && lawyers.length > 0) {
      const law = lawyers.find((lawyer) => lawyer._id === lawId);
      setLawyerData(law);
    }
  });

  console.log("lawId:", lawId);
  console.log(lawyerData);

  return (
    <div className="p-8 w-full animate-fadeIn">
      <div className="flex items-start w-full">
        <h1 className="rounded text-dark-brown text-xl font-medium mb-6">
          ข้อมูลทนาย{" "}
          {lawyerData ? `${lawyerData.firstName} ${lawyerData.lastName}` : ""}
        </h1>
      </div>

      <div className="bg-[#FFFFFF] w-full max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10">
        <div className="border border-[#E7E7E7] rounded p-8">
          <div className="flex items-start">
            {/* รูปโปรไฟล์ */}
            <div className="w-full">
              <div className="flex flex-col">
                <div className="flex flex-col items-center">
                  <img
                    src={lawyerData ? lawyerData.image : ""}
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
              <p className="text-dark-brown text-xl mb-5 mt-10 font-medium">
                ข้อมูลส่วนตัว
              </p>
            </div>

            {/* ชื่อจริง, นามสกุุล */}
            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">ชื่อจริง</label>

                <p className="text-lg">
                  {lawyerData ? `${lawyerData.firstName}` : ""}
                </p>
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">นามสกุล</label>

                <p className="text-lg">
                  {lawyerData ? `${lawyerData.lastName}` : ""}
                </p>
              </div>
            </div>

            {/* วันเกิด, เพศ */}
            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">วันเกิด</label>

                <p className="text-lg">
                  {lawyerData && lawyerData.dob
                    ? new Date(lawyerData.dob).toLocaleDateString("th-TH", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : ""}
                </p>
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">เพศ</label>

                <p className="text-lg">
                  {lawyerData && lawyerData.gender
                    ? lawyerData.gender === "male"
                      ? "ชาย"
                      : "หญิง"
                    : ""}
                </p>
              </div>
            </div>

            {/* เบอร์โทร, อีเมล */}
            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">เบอร์โทร</label>

              <p className="text-lg">{lawyerData ? lawyerData.phone : ""}</p>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">อีเมล</label>
              <p className="text-lg">{lawyerData ? lawyerData.email : ""}</p>
            </div>
          </div>
        </div>

        <div className="border border-[#E7E7E7] rounded p-8 mt-8">
          {/* ข้อมูลการทำงาน */}
          <div>
            <p className="text-dark-brown text-xl mb-5 mt-4 font-medium">
              ข้อมูลการทำงาน
            </p>
          </div>

          {/* เลขที่ใบอนุญาตว่าความ, บัตรประชาชน */}
          <div className="mt-6 flex flex-row gap-10">
            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">
                เลขที่ใบอนุญาตว่าความ
              </label>
              <p className="text-lg">
                {lawyerData ? lawyerData.license_number : ""}
              </p>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">บัตรประชาชน</label>
              <p className="text-lg">
                {lawyerData ? lawyerData.lawyerNationalId : ""}
              </p>
            </div>
          </div>

          <div>
            <p className="text-dark-brown text-lg mb-2 mt-10 font-medium">
              เวลาให้บริการ
            </p>

            {/* วัน เวลา */}
            <div className="space-y-4">
              {lawyerData?.available_slots?.map((slot, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">วัน</label>
                      <p className="text-lg">{slot.day || ""}</p>
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาเริ่มให้คำปรึกษา
                      </label>
                      <p className="text-lg">{slot.startTime || ""}</p>
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาสิ้นสุดการให้คำปรึกษา
                      </label>
                      <p className="text-lg">{slot.endTime || ""}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ความเชี่ยวชาญ */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ความเชี่ยวชาญ
            </p>

            <div className="flex flex-wrap gap-2">
              {lawyerData?.speciality?.map((item, index) => (
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
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              เนติบัณฑิต
            </p>

            <div className="flex w-1/3">
              <label className="flex items-center w-[300px]">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={lawyerData?.is_thaibar || false}
                  disabled
                />
                เนติบัณฑิต
              </label>
            </div>
          </div>

          {/* ประวัติการศึกษา */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการศึกษา
            </p>
            {lawyerData?.education?.map((edu, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มการศึกษา
                    </label>

                    <p className="text-lg">{edu.enrollmentYear || ""}</p>
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่จบการศึกษา
                    </label>

                    <p className="text-lg">{edu.graduationYear || ""}</p>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ระดับการศึกษาและสาขาวิชา
                    </label>

                    <p className="text-lg">{edu.degree || ""}</p>
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถาบันการศึกษา
                    </label>

                    <p className="text-lg">{edu.institution || ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ประวัติการทำงาน */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการทำงาน
            </p>
            {lawyerData?.work_experience?.map((work, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มทำงาน
                    </label>

                    <p className="text-lg">{work.startDate || ""}</p>
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่สิ้นสุดการทำงาน
                    </label>

                    <p className="text-lg">{work.endDate || ""}</p>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ตำแหน่ง/อาชีพ
                    </label>

                    <p className="text-lg">{work.position || ""}</p>
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถานประกอบการ
                    </label>

                    <p className="text-lg">{work.company || ""}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ค่าบริการและแนะนำตัว */}
        <div className="border border-[#E7E7E7] rounded p-8 mt-8">
          <div>
            <p className="text-dark-brown text-lg mb-4 font-medium">
              ค่าบริการและแนะนำตัว
            </p>
            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="mb-2 text-dark-brown">ค่าบริการ</label>
                <div className="flex flex-row items-center gap-2">
                  <p className="text-lg">เริ่มต้น</p>
                  <p className="text-lg">
                    {lawyerData?.fees_detail || ""} บาท ต่อ 30 นาที
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-dark-brown">
                  แนะนำตัว/ข้อมูลเพิ่มเติม
                </label>
                <p className="text-lg">{lawyerData?.bio || ""}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutLawyer;
