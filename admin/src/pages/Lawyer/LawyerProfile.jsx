import React, { useContext, useEffect, useState } from "react";
import { LawyerContext } from "../../context/LawyerContext";
import { AppContext } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../../assets/assets";

const LawyerProfile = () => {
  const {
    lawyerToken,
    profileData,
    setProfileData,
    getProfileData,
    backendUrl,
  } = useContext(LawyerContext);

  const [isEdit, setIsEdit] = useState(false);

  const updateProfile = async () => {
    try {
      const updateData = {
        fees_detail: profileData.fees_detail,
        bio: profileData.bio,
      };

      const { data } = await axios.post(
        backendUrl + "/api/lawyer/update-profile",
        updateData,
        { headers: { lawyerToken } }
      );

      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

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
      <div className="bg-[#FFFFFF] w-full max-w-7xl min-h-[800px] mt-2 mx-auto px-20 py-10 mb-10">
        <div className="border border-[#E7E7E7] rounded p-8">
          <div className="flex items-start">
            {/* รูปโปรไฟล์ */}
            <div className="w-full">
              <div className="flex flex-col">
                <div className="flex flex-col items-center">
                  {isEdit ? (
                    <div className="flex flex-col items-center">
                      <img
                        src={profileData.image}
                        alt=""
                        className="w-60 h-60 rounded object-cover"
                      />
                      <button
                        type="button"
                        className="mt-5 py-2 px-4 border border-primary rounded-full text-primary hover:bg-primary hover:text-white"
                      >
                        อัปโหลดรูปภาพ
                      </button>
                    </div>
                  ) : (
                    <img
                      src={profileData.image}
                      alt=""
                      className="w-60 h-60 rounded object-cover"
                    />
                  )}
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
                {isEdit ? (
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {profileData.firstName}
                  </p>
                ) : (
                  <p className="text-lg">{profileData.firstName}</p>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">นามสกุล</label>
                {isEdit ? (
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {profileData.lastName}
                  </p>
                ) : (
                  <p className="text-lg">{profileData.lastName}</p>
                )}
              </div>
            </div>

            {/* วันเกิด, เพศ */}
            <div className="flex gap-10">
              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">วันเกิด</label>
                {isEdit ? (
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {profileData.dob}
                  </p>
                ) : (
                  <p className="text-lg">{profileData.dob}</p>
                )}
              </div>

              <div className="flex flex-col w-1/2">
                <label className="mb-2 text-dark-brown">เพศ</label>
                {isEdit ? (
                  <p className="border border-[#DADADA] rounded p-2 bg-white">
                    {profileData.gender === "male" ? "ชาย" : "หญิง"}
                  </p>
                ) : (
                  <p className="text-lg">
                    {profileData.gender === "male" ? "ชาย" : "หญิง"}
                  </p>
                )}
              </div>
            </div>

            {/* เบอร์โทร, อีเมล */}
            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">เบอร์โทร</label>
              {isEdit ? (
                <p className="border border-[#DADADA] rounded p-2 bg-white">
                  {profileData.phone}
                </p>
              ) : (
                <p className="text-lg">{profileData.phone}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">อีเมล</label>
              <p className="text-lg">{profileData.email}</p>
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
              <p className="text-lg">{profileData.license_number}</p>
            </div>

            <div className="flex flex-col w-full">
              <label className="mb-2 text-dark-brown">บัตรประชาชน</label>
              <p className="text-lg">{profileData.lawyerNationalId}</p>
            </div>
          </div>

          {/* เวลาให้บริการ */}
          <div>
            <p className="text-dark-brown text-lg mb-2 mt-10 font-medium">
              เวลาให้บริการ
            </p>

            {/* วัน เวลา */}
            <div className="space-y-4">
              {profileData.available_slots?.map((slot, index) => (
                <div key={index} className="flex flex-col gap-1">
                  <div className="flex flex-row w-full gap-10">
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">วัน</label>
                      {isEdit ? (
                        <p className="border border-[#DADADA] rounded p-2 bg-white">
                          {slot.day}
                        </p>
                      ) : (
                        <p className="text-lg">{slot.day}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาเริ่มให้คำปรึกษา
                      </label>
                      {isEdit ? (
                        <p className="border border-[#DADADA] rounded p-2 bg-white">
                          {slot.startTime}
                        </p>
                      ) : (
                        <p className="text-lg">{slot.startTime}</p>
                      )}
                    </div>
                    <div className="flex flex-col w-1/3">
                      <label className="mb-2 text-dark-brown">
                        เวลาสิ้นสุดการให้คำปรึกษา
                      </label>
                      {isEdit ? (
                        <p className="border border-[#DADADA] rounded p-2 bg-white">
                          {slot.endTime}
                        </p>
                      ) : (
                        <p className="text-lg">{slot.endTime}</p>
                      )}
                    </div>
                  </div>
                  <div>
                    {isEdit ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteSlot(index)}
                        className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                      >
                        <img
                          src={assets.Delete}
                          alt="Delete Icon"
                          className="w-6 h-6"
                        />
                      </button>
                    ) : (
                      <div></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มเวลาให้บริการ
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {/* ความเชี่ยวชาญ */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ความเชี่ยวชาญ
            </p>
            {isEdit ? (
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
                    กฎหมายภาษี
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

                <div className="flex w-full">
                  <label className="flex items-center w-[300px]">
                    <input type="checkbox" className="mr-2" />
                    กฎหมายล้มละลาย
                  </label>
                </div>
              </div>
            ) : (
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
            )}
          </div>

          {/* เนติบัณฑิต */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              เนติบัณฑิต
            </p>
            {isEdit ? (
              <div className="flex w-1/3">
                <label className="flex items-center w-[300px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    // checked={is_thaibar}
                    // onChange={(e) => setIs_thaibar(e.target.checked)}
                  />
                  เนติบัณฑิต
                </label>
              </div>
            ) : (
              <div className="flex w-1/3">
                <label className="flex items-center w-[300px]">
                  <input
                    type="checkbox"
                    className="mr-2"
                    // checked={is_thaibar}
                    // onChange={(e) => setIs_thaibar(e.target.checked)}
                  />
                  เนติบัณฑิต
                </label>
              </div>
            )}
          </div>

          {/* ประวัติการศึกษา */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการศึกษา
            </p>
            {profileData.education?.map((edu, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{edu.enrollmentYear}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่จบการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{edu.graduationYear}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ระดับการศึกษาและสาขาวิชา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{edu.degree}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถาบันการศึกษา
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{edu.institution}</p>
                    )}
                  </div>
                </div>

                {/* ปุ่มลบ */}
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(index)}
                    className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={assets.Delete}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มประวัติการศึกษา
                </button>
              </div>
            ) : (
              <div></div>
            )}
          </div>

          {/* ประวัติการทำงาน */}
          <div>
            <p className="text-dark-brown text-lg mb-4 mt-10 font-medium">
              ประวัติการทำงาน
            </p>
            {profileData.work_experience?.map((work, index) => (
              <div key={index} className="mb-8 relative">
                {/* เพิ่ม relative */}
                <div className="flex gap-10 mb-2">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่เริ่มทำงาน
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{work.startDate}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ปีที่สิ้นสุดการทำงาน
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{work.endDate}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      ตำแหน่ง/อาชีพ
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{work.position}</p>
                    )}
                  </div>

                  <div className="flex flex-col w-1/2">
                    <label className="mb-2 text-dark-brown">
                      สถานประกอบการ
                    </label>
                    {isEdit ? (
                      <input
                        type="text"
                        className="w-full border border-[#DADADA] rounded p-2"
                      />
                    ) : (
                      <p className="text-lg">{work.company}</p>
                    )}
                  </div>
                </div>

                {/* ปุ่มลบ */}
                {isEdit ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteSlot(index)}
                    className="mt-2 rounded-full text-white hover:scale-105 transition-transform duration-200"
                  >
                    <img
                      src={assets.Delete}
                      alt="Delete Icon"
                      className="w-6 h-6"
                    />
                  </button>
                ) : (
                  <div></div>
                )}
              </div>
            ))}
            {isEdit ? (
              <div className="flex items-start mt-4">
                <button
                  type="button"
                  className="bg-[#A3806C] text-white py-1 px-6 rounded hover:scale-105 transition-transform duration-200 text-sm"
                >
                  เพิ่มประวัติการทำงาน
                </button>
              </div>
            ) : (
              <div></div>
            )}
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
                    {isEdit ? (
                      <input
                        type="string"
                        className="border border-[#DADADA] rounded p-2 bg-white mr-2"
                        onChange={(e) =>
                          setProfileData((prev) => ({
                            ...prev,
                            fees_detail: e.target.value,
                          }))
                        }
                        value={profileData.fees_detail}
                      />
                    ) : (
                      profileData.fees_detail
                    )}{" "}
                    บาท ต่อ 30 นาที
                  </p>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="mb-2 text-dark-brown">
                  แนะนำตัว/ข้อมูลเพิ่มเติม
                </label>
                <p className="">
                  {isEdit ? (
                    <textarea
                      className="w-full min-h-[100px] p-2 border border-[#DADADA] rounded"
                      onChange={(e) =>
                        setProfileData((prev) => ({
                          ...prev,
                          bio: e.target.value,
                        }))
                      }
                      value={profileData.bio}
                    />
                  ) : (
                    <p className="text-lg">{profileData.bio}</p>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {isEdit ? (
          <button
            onClick={updateProfile}
            className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
          >
            บันทึกข้อมูล
          </button>
        ) : (
          <button
            onClick={() => setIsEdit(true)}
            className="mt-8 bg-primary hover:bg-primary/90 text-white px-8 py-2 rounded-full font-medium transition-colors duration-200 flex items-center gap-2"
          >
            แก้ไขข้อมูล
          </button>
        )}
      </div>
    </div>
  );
};

export default LawyerProfile;
